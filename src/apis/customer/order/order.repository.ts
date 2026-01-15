import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createOrder(createOrderDto: CreateOrderDto) {
		const { orderDetails, ...orderData } = createOrderDto;

		// Tính toán các giá trị nếu chưa có
		const subTotal = orderData.subTotal ?? orderDetails.reduce((sum, detail) => {
			return sum + (detail.totalAmount ?? detail.price * detail.quantity);
		}, 0);

		const totalAmount = orderData.totalAmount ?? subTotal - (orderData.totalDiscount ?? 0) + (orderData.shippingFee ?? 0);

		// Tạo đơn hàng với transaction
		const order = await this.prisma.$transaction(async (tx) => {
			// Tạo đơn hàng
			const newOrder = await tx.customer_order.create({
				data: {
					uuid: uuidv4(),
					orderCode: '', // Sẽ được cập nhật sau khi có id
					orderDate: new Date(),
					subTotal,
					totalDiscount: orderData.totalDiscount ?? 0,
					totalAmount,
					shippingFee: orderData.shippingFee ?? 0,
					discountCode: orderData.discountCode,
					paymentMethod: orderData.paymentMethod ?? 'cash',
					paymentStatus: 'pending',
					status: 'pending',
					shippingAddress: orderData.shippingAddress,
					shippingPhone: orderData.shippingPhone,
					shippingName: orderData.shippingName,
					customerId: orderData.customerId,
				},
			});

			// Cập nhật orderCode dựa trên id
			const { generateOrderCode } = await import('@common');
			const orderCode = generateOrderCode(newOrder.id);

			const updatedOrder = await tx.customer_order.update({
				where: { id: newOrder.id },
				data: { orderCode },
			});

			// Tạo chi tiết đơn hàng
			const orderDetailsData = orderDetails.map((detail) => ({
				uuid: uuidv4(),
				customerOrderId: updatedOrder.id,
				productId: detail.productId,
				productName: detail.productName,
				quantity: detail.quantity,
				price: detail.price,
				originalPrice: detail.originalPrice ?? detail.price,
				discount: detail.discount ?? 0,
				discountedPrice: detail.discountedPrice ?? detail.price,
				totalAmount: detail.totalAmount ?? detail.price * detail.quantity,
			}));

			await tx.customer_order_detail.createMany({
				data: orderDetailsData,
			});

			// Lấy đơn hàng với chi tiết
			return tx.customer_order.findUnique({
				where: { id: updatedOrder.id },
				include: {
					customerOrderDetails: true,
					customer: {
						select: {
							id: true,
							email: true,
							fullName: true,
						},
					},
				},
			});
		});

		return order;
	}

	async getOrderById(id: number) {
		return this.prisma.customer_order.findUnique({
			where: { id },
			include: {
				customerOrderDetails: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
				customer: {
					select: {
						id: true,
						email: true,
						fullName: true,
					},
				},
			},
		});
	}

	async getOrderByUuid(uuid: string) {
		return this.prisma.customer_order.findUnique({
			where: { uuid },
			include: {
				customerOrderDetails: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
				customer: {
					select: {
						id: true,
						email: true,
						fullName: true,
					},
				},
			},
		});
	}

	async updateOrderPaymentStatus(id: number, paymentStatus: string) {
		return this.prisma.customer_order.update({
			where: { id },
			data: {
				paymentStatus,
			},
		});
	}

	async updateOrderStatus(id: number, status: string) {
		return this.prisma.customer_order.update({
			where: { id },
			data: { status },
		});
	}
}
