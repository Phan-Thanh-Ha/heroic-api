import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { configuration } from '../config/configuration';
import { SendMailOtpDto } from './dto/send-mail-otp.dto';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);
	private readonly resend: Resend;
	private readonly mailConfig = configuration().mail.resend;

	constructor() {
		if (!this.mailConfig.apiKey) {
			this.logger.warn('RESEND_API_KEY chưa được cấu hình');
		}
		this.resend = new Resend(this.mailConfig.apiKey);
	}

	async sendMailOTP(sendMailOtpDto: SendMailOtpDto) {
		try {
			const fromEmail = this.mailConfig.fromEmail;
			const fromName = this.mailConfig.fromName;

			const result = await this.resend.emails.send({
				from: `${fromName} <${fromEmail}>`,
				to: sendMailOtpDto.email,
				subject: 'OTP Verification',
				text: `Your OTP is ${sendMailOtpDto.otpCode}`,
			});

			if (result.error) {
				throw new Error(result.error.message || 'Lỗi khi gửi email qua Resend');
			}

			this.logger.log(`Email OTP đã được gửi thành công đến ${sendMailOtpDto.email} với ID: ${result.data?.id}`);

			return {
				success: true,
				message: 'Email OTP đã được gửi thành công',
				messageId: result.data?.id,
			};
		} catch (error) {
			this.logger.error(`Lỗi khi gửi email OTP: ${error.message}`, error.stack);
			throw new Error(`Không thể gửi email OTP: ${error.message}`);
		}
	}
}
