import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { VerifyOtpDto } from "../dto/verify-otp.dto";

export const ApiVerifyOtp = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Xác thực mã OTP',
            description: 'Kiểm tra mã OTP có đúng hay không. Sau khi xác thực thành công, mã OTP sẽ bị xóa và không thể sử dụng lại.',
        }),
        ApiBody({ type: VerifyOtpDto }),
        ApiResponse({
            status: 200,
            description: 'Xác thực OTP thành công',
            schema: {
                type: 'object',
                properties: {
                    message: {
                        type: 'object',
                        properties: {
                            vi: { type: 'string', example: 'Xác thực OTP thành công' },
                            en: { type: 'string', example: 'OTP verification successful' },
                            cn: { type: 'string', example: 'OTP验证成功' },
                        },
                    },
                    info: {
                        type: 'object',
                        description: 'Thông tin khách hàng',
                    },
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: 'Lỗi xác thực OTP (OTP không đúng, không tìm thấy OTP, hoặc OTP đã hết hạn)',
            schema: {
                type: 'object',
                properties: {
                    status: { type: 'number', example: 400 },
                    data: {
                        type: 'object',
                        properties: {
                            error_code: { type: 'string', example: 'OTP_INCORRECT' },
                            message: {
                                type: 'object',
                                properties: {
                                    vi: { type: 'string', example: 'Mã OTP không đúng' },
                                    en: { type: 'string', example: 'OTP code is incorrect' },
                                    cn: { type: 'string', example: 'OTP代码不正确' },
                                },
                            },
                        },
                    },
                },
            },
        }),
    );
};

