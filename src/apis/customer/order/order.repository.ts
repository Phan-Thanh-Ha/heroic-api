import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { CreateOrderDto } from './dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayloadCustomer } from '@jwt';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { generateOrderCode } from '@common';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createOrder(createOrderDto: CreateOrderDto, customerInfor: JwtPayloadCustomer) {
    const { cartItems, ...orderData } = createOrderDto;


    // Tạo đơn hàng với transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Tạo đơn hàng
      const newOrder = await tx.customer_order.create({
        data: {
          uuid: uuidv4(),
          orderCode: '', // Sẽ được cập nhật sau khi có id
          orderDate: new Date(),// Ngày tạo đơn
          deliveryDate: new Date(),// Ngày giao hàng
          subTotal: orderData.subTotal, // Tổng tiền hàng khi trừ giảm giá
          totalDiscount: orderData.totalDiscount ?? 0, // Tổng giảm giá
          totalAmount: orderData.totalAmount ?? 0, // Tổng tiền hàng ban đầu
          status: 'pending',// Trạng thái đơn hàng
          shippingFee: orderData.shippingFee ?? 0,// Phí vận chuyển
          discountCode: orderData.discountCode, // Mã giảm giá
          paymentMethod: orderData.paymentMethod ?? 'cash',// Phương thức thanh toán
          paymentStatus: 'pending',// Trạng thái thanh toán
          shippingAddress: orderData.shippingAddress, // Địa chỉ giao hàng
          shippingPhone: orderData.shippingPhone, // Số điện thoại giao hàng
          shippingName: orderData.shippingName, // Tên người nhận
          customerId: customerInfor.customerId, // khách hàng tạo đơn
          createdAt: new Date(), // Ngày tạo đơn
        },
      });

      // Cập nhật orderCode dựa trên id

      const orderCode = generateOrderCode(newOrder.id);

      const updatedOrder = await tx.customer_order.update({
        where: { id: newOrder.id },
        data: { orderCode },
      });

      // Lấy danh sách productId từ tất cả các chi tiết sản phẩm productIds [ 1, 2 ]
      const productIds = cartItems.flatMap(item =>
        item.productDetails?.map(detail => detail.productId) || []
      );
      console.log('productIds', productIds);

      // Lọc trùng productId
      const uniqueProductIds = [...new Set(productIds)];

      // Lấy thông tin sản phẩm (name) từ DB
      const products = await tx.product.findMany({
        where: { id: { in: uniqueProductIds } },
        select: { id: true, name: true }
      });

      // Tạo map id -> name để tra cứu nhanh
      const productMap = new Map(products.map(p => [p.id, p.name]));

      // Tạo chi tiết đơn hàng
      const orderDetailsData = cartItems.flatMap(item =>
        // Duyệt qua từng detail trong item
        item.productDetails?.map(detail => {
          const productName = productMap.get(detail.productId) || '';

          const price = detail.retailPrice ?? 0;
          const quantity = detail.quantity ?? 1;
          const discountPercentage = detail.discount ?? 0;

          // Tính giá sau giảm giá
          const discountAmount = (price * discountPercentage) / 100;
          const discountedPrice = price - discountAmount;
          const totalAmount = discountedPrice * quantity;

          return {
            uuid: uuidv4(),
            customerOrderId: newOrder.id,
            productId: detail.productId,
            productName: productName,
            quantity: quantity,
            price: price,
            originalPrice: price, // Giả sử giá gốc là retail price nếu không có logic khác
            discount: discountPercentage,
            discountedPrice: discountedPrice,
            totalAmount: totalAmount,
          };
        }) || []
      );

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
