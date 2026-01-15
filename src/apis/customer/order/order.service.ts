import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderRepository } from './order.repository';
import { PayOSService } from '@payos';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';

@Injectable()
export class OrderService {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly payosService: PayOSService,
		private readonly configService: ConfigService,
	) {}

	async createOrder(createOrderDto: CreateOrderDto) {
		if (!createOrderDto.orderDetails || createOrderDto.orderDetails.length === 0) {
			throw new BadRequestException('Order details cannot be empty');
		}

		const order = await this.orderRepository.createOrder(createOrderDto);
		return order;
	}

	async getOrderById(id: number) {
		const order = await this.orderRepository.getOrderById(id);
		if (!order) {
			throw new NotFoundException(`Order with ID ${id} not found`);
		}
		return order;
	}

	async getOrderByUuid(uuid: string) {
		const order = await this.orderRepository.getOrderByUuid(uuid);
		if (!order) {
			throw new NotFoundException(`Order with UUID ${uuid} not found`);
		}
		return order;
	}

	async createPaymentLink(createPaymentLinkDto: CreatePaymentLinkDto) {
		const { orderId, returnUrl, cancelUrl } = createPaymentLinkDto;

		// Lấy thông tin đơn hàng
		const order = await this.getOrderById(orderId);

		if (order.paymentStatus === 'paid') {
			throw new BadRequestException('Order has already been paid');
		}

		// Tạo payment code từ order id (PayOS yêu cầu orderCode là số nguyên)
		// Sử dụng order id làm payment code, đảm bảo tính duy nhất
		const paymentCode = order.id;

		// Lấy URL từ config hoặc dùng URL được truyền vào
		const defaultReturnUrl = this.configService.get<string>('payos.returnUrl');
		const defaultCancelUrl = this.configService.get<string>('payos.cancelUrl');

		// Tạo payment link từ PayOS
		const paymentLink = await this.payosService.createPaymentLink({
			orderCode: paymentCode,
			amount: Math.round(order.totalAmount), // PayOS yêu cầu số nguyên (VNĐ)
			description: `Thanh toán đơn hàng ${order.orderCode}`,
			returnUrl: returnUrl || defaultReturnUrl || `http://localhost:3103/v1/customer/order/payment/return?orderId=${orderId}`,
			cancelUrl: cancelUrl || defaultCancelUrl || `http://localhost:3103/v1/customer/order/payment/cancel?orderId=${orderId}`,
		});

		// Lưu payment code vào đơn hàng (nếu cần)
		// await this.orderRepository.updateOrderPaymentStatus(orderId, 'pending', paymentCode);

		return {
			orderId: order.id,
			orderCode: order.orderCode,
			paymentLink: paymentLink.checkoutUrl,
			paymentCode,
		};
	}

	async handlePaymentWebhook(webhookData: any) {
		try {
			// Xác thực webhook từ PayOS
			const verifiedData = await this.payosService.verifyWebhook(webhookData);

			const { orderCode, status } = (verifiedData as any)?.payment ?? { orderCode: 0, status: 'pending' };

			// Tìm đơn hàng theo payment code (orderCode từ PayOS)
			const order = await this.orderRepository.getOrderById(orderCode);

			if (!order) {
				throw new NotFoundException(`Order with payment code ${orderCode} not found`);
			}

			// Cập nhật trạng thái thanh toán
			let paymentStatus = 'pending';
			let orderStatus = order.status;

			if (status === 'PAID') {
				paymentStatus = 'paid';
				// Có thể tự động chuyển đơn hàng sang trạng thái confirmed khi thanh toán thành công
				if (orderStatus === 'pending') {
					orderStatus = 'confirmed';
				}
			} else if (status === 'CANCELLED') {
				paymentStatus = 'cancelled';
			} else if (status === 'EXPIRED') {
				paymentStatus = 'expired';
			}

			await this.orderRepository.updateOrderPaymentStatus(order.id, paymentStatus);
			if (orderStatus !== order.status) {
				await this.orderRepository.updateOrderStatus(order.id, orderStatus);
			}

			return {
				success: true,
				orderId: order.id,
				paymentStatus,
				orderStatus,
			};
		} catch (error) {
			throw new BadRequestException(`Webhook verification failed: ${error.message}`);
		}
	}

	async handlePaymentReturn(orderId: number) {
		const order = await this.getOrderById(orderId);

		// Kiểm tra trạng thái thanh toán từ PayOS
		try {
			const paymentRequest = await this.payosService.getPaymentRequest(order.id);
			
			return {
				orderId: order.id,
				orderCode: order.orderCode,
				paymentStatus: order.paymentStatus,
				payosStatus: paymentRequest.status,
				message: paymentRequest.status === 'PAID' 
					? 'Thanh toán thành công!' 
					: 'Thanh toán chưa hoàn tất',
			};
		} catch (error) {
			return {
				orderId: order.id,
				orderCode: order.orderCode,
				paymentStatus: order.paymentStatus,
				message: 'Không thể kiểm tra trạng thái thanh toán',
			};
		}
	}
}
