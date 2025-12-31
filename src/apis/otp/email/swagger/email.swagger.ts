import { ROUTER_TAG_ENUM } from "@common"
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { SendMailOtpDto } from "src/mail/dto/send-mail-otp.dto"
import { EmailEntity } from "../entities/email.entity"
import { applyDecorators } from "@nestjs/common"

export const ApiSendMailOtp = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Gửi mail OTP',
            description: 'Gửi mail OTP để xác thực email',
            tags: [ROUTER_TAG_ENUM.MAIL.SEND_OTP],
        }),
        ApiBody({ type: EmailEntity }),
        ApiResponse({
            status: 200,
            description: 'Gửi mail OTP thành công',
            type: EmailEntity,
        }),
    );
}