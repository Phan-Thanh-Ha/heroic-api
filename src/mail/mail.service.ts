import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { configuration } from '../config/configuration';
import { SendMailOtpDto } from './dto/send-mail-otp.dto';
import { EmailRendererService } from './email-renderer.service';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly resend: Resend | null = null; // Khởi tạo là null
    private readonly mailConfig = configuration().mail.resend;

    constructor(private readonly emailRenderer: EmailRendererService) {
        if (!this.mailConfig.apiKey) {
            this.logger.warn('⚠️ RESEND_API_KEY chưa được cấu hình. Chức năng gửi mail sẽ bị vô hiệu hóa.');
            // Không chạy dòng khởi tạo Resend nữa
        } else {
            // Chỉ khởi tạo khi thực sự có API Key
            this.resend = new Resend(this.mailConfig.apiKey);
        }
    }

    async sendMailOTP(sendMailOtpDto: SendMailOtpDto, userName?: string) {
        // Kiểm tra xem dịch vụ resend đã được khởi tạo chưa
        if (!this.resend) {
            this.logger.error('Cố gắng gửi mail nhưng Resend API Key chưa được cấu hình.');
            throw new Error('Hệ thống gửi mail hiện không khả dụng.');
        }

        try {
            const fromEmail = this.mailConfig.fromEmail;
            const fromName = this.mailConfig.fromName;

            const html = await this.emailRenderer.renderOtpEmail(
                sendMailOtpDto.otp,
                userName,
            );
            const text = await this.emailRenderer.renderOtpEmailText(
                sendMailOtpDto.otp,
                userName,
            );

            const result = await this.resend.emails.send({
                from: `${fromName} <${fromEmail}>`,
                to: sendMailOtpDto.email,
                subject: 'Xác thực OTP - Heroic',
                html,
                text,
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