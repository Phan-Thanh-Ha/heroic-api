import { ApiPost, ApiGet, APP_ROUTES, AppController, Public } from '@common';
import { Body, Param, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';

@AppController(APP_ROUTES.CUSTOMER.ORDER)
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@ApiPost('', {
		summary: 'Tạo đơn hàng mới',
		status: 201,
	})
	async createOrder(@Body() createOrderDto: CreateOrderDto) {
		return await this.orderService.createOrder(createOrderDto);
	}

	@ApiGet(':id', {
		summary: 'Lấy thông tin đơn hàng theo ID',
	})
	async getOrderById(@Param('id') id: string) {
		return await this.orderService.getOrderById(+id);
	}

	@ApiGet('uuid/:uuid', {
		summary: 'Lấy thông tin đơn hàng theo UUID',
	})
	async getOrderByUuid(@Param('uuid') uuid: string) {
		return await this.orderService.getOrderByUuid(uuid);
	}

	@ApiPost('payment/create-link', {
		summary: 'Tạo payment link từ PayOS',
	})
	async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto) {
		return await this.orderService.createPaymentLink(createPaymentLinkDto);
	}

	@ApiPost('payment/webhook', {
		summary: 'Webhook nhận thông báo thanh toán từ PayOS',
	})
	@Public()
	async handlePaymentWebhook(@Body() webhookData: any) {
		return await this.orderService.handlePaymentWebhook(webhookData);
	}

	@ApiGet('payment/return', {
		summary: 'Xử lý khi khách hàng quay lại sau khi thanh toán',
	})
	@Public()
	async handlePaymentReturn(@Query('orderId') orderId: string) {
		return await this.orderService.handlePaymentReturn(+orderId);
	}

	@ApiGet('payment/cancel', {
		summary: 'Xử lý khi khách hàng hủy thanh toán',
	})
	@Public()
	async handlePaymentCancel(@Query('orderId') orderId: string) {
		return await this.orderService.handlePaymentReturn(+orderId);
	}
}
