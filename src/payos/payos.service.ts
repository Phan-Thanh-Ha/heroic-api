import { Injectable, Logger } from '@nestjs/common';
import { PayOS } from '@payos/node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayOSService {
	private readonly logger = new Logger(PayOSService.name);
	private payos: PayOS | null = null;

	constructor(private configService: ConfigService) {
		const clientId = this.configService.get<string>('PAYOS_CLIENT_ID');
		const apiKey = this.configService.get<string>('PAYOS_API_KEY');
		const checksumKey = this.configService.get<string>('PAYOS_CHECKSUM_KEY');

		if (!clientId || !apiKey || !checksumKey) {
			this.logger.warn('⚠️ PayOS credentials not found. PayOS service will not be initialized.');
			return;
		}

		this.payos = new PayOS({
			clientId,
			apiKey,
			checksumKey,
		});

		this.logger.log('✅ PayOS service initialized successfully');
	}

	/**
	 * Tạo payment link từ PayOS
	 * @param orderCode - Mã đơn hàng (phải là số nguyên)
	 * @param amount - Số tiền (đơn vị: VNĐ)
	 * @param description - Mô tả đơn hàng
	 * @param returnUrl - URL trả về sau khi thanh toán thành công
	 * @param cancelUrl - URL trả về khi hủy thanh toán
	 */
	async createPaymentLink(params: {
		orderCode: number;
		amount: number;
		description: string;
		returnUrl: string;
		cancelUrl: string;
	}) {
		try {
			if (!this.payos) {
				throw new Error('PayOS service is not initialized. Please check your PayOS credentials.');
			}

			const paymentLink = await this.payos.paymentRequests.create({
				orderCode: params.orderCode,
				amount: params.amount,
				description: params.description,
				returnUrl: params.returnUrl,
				cancelUrl: params.cancelUrl,
			});

			this.logger.log(`Payment link created for order code: ${params.orderCode}`);
			return paymentLink;
		} catch (error) {
			this.logger.error(`Failed to create payment link: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Xác thực webhook từ PayOS
	 * @param webhookData - Dữ liệu webhook từ PayOS
	 */
	async verifyWebhook(webhookData: any) {
		try {
			if (!this.payos) {
				throw new Error('PayOS service is not initialized.');
			}

			const verifiedData = await this.payos.webhooks.verify(webhookData);
			return verifiedData;
		} catch (error) {
			this.logger.error(`Failed to verify webhook: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Lấy thông tin payment request theo order code
	 * @param orderCode - Mã đơn hàng
	 */
	async getPaymentRequest(orderCode: number) {
		try {
			if (!this.payos) {
				throw new Error('PayOS service is not initialized.');
			}

			const paymentRequest = await this.payos.paymentRequests.get(orderCode);
			return paymentRequest;
		} catch (error) {
			this.logger.error(`Failed to get payment request: ${error.message}`, error.stack);
			throw error;
		}
	}

	/**
	 * Hủy payment link
	 * @param orderCode - Mã đơn hàng
	 */
	async cancelPaymentLink(orderCode: number) {
		try {
			if (!this.payos) {
				throw new Error('PayOS service is not initialized.');
			}

			const result = await this.payos.paymentRequests.cancel(orderCode);
			this.logger.log(`Payment link cancelled for order code: ${orderCode}`);
			return result;
		} catch (error) {
			this.logger.error(`Failed to cancel payment link: ${error.message}`, error.stack);
			throw error;
		}
	}
}
