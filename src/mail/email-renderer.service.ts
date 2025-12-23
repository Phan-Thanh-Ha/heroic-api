import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import { OtpEmail } from './templates/otp-email';

@Injectable()
export class EmailRendererService {
  private readonly logger = new Logger(EmailRendererService.name);

  /**
   * Render OTP email template thành HTML
   */
  async renderOtpEmail(otpCode: string, userName?: string): Promise<string> {
    try {
      const html = await render(
        OtpEmail({
          otpCode,
          userName,
        }),
      );
      return html;
    } catch (error) {
      this.logger.error(`Lỗi khi render OTP email: ${error.message}`, error.stack);
      throw new Error(`Không thể render email template: ${error.message}`);
    }
  }

  /**
   * Render OTP email template thành plain text
   */
  async renderOtpEmailText(otpCode: string, userName?: string): Promise<string> {
    try {
      const text = await render(
        OtpEmail({
          otpCode,
          userName,
        }),
        {
          plainText: true,
        },
      );
      return text;
    } catch (error) {
      this.logger.error(`Lỗi khi render OTP email text: ${error.message}`, error.stack);
      throw new Error(`Không thể render email template text: ${error.message}`);
    }
  }
}

