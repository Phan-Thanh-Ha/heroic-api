import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();

        // 1. Xác định mã trạng thái lỗi
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // 2. Lấy nội dung phản hồi thô
        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal Server Error' };

        const data = typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as any)
                : { message: exceptionResponse };

        // 3. Xử lý ngôn ngữ
        const rawLang = (request.headers['x-language'] as string) || 'vi';
        const lang = rawLang.startsWith('en') ? 'en' : 'vi';

        // 4. Khởi tạo cấu trúc Response Body (BỔ SUNG CÁC TRƯỜNG BẠN CẦN)
        const responseBody: any = {
            status: 'error',                 // Bổ sung: Luôn là error khi vào Filter này
            code: httpStatus,                // Bổ sung: Trùng với statusCode
            success: false,                  // Bổ sung: Luôn là false
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        // 5. Xử lý chi tiết nội dung lỗi
        if (httpStatus === HttpStatus.BAD_REQUEST) {
            responseBody.error = 'Bad Request';
            
            if (data.errors) {
                // Lỗi từ ValidationPipe tùy chỉnh
                responseBody.message = 'Dữ liệu không hợp lệ.';
                responseBody.data = data.errors; // Chuyển 'details' thành 'data' để đồng bộ
            } else {
                // Lỗi 400 mặc định của NestJS
                responseBody.message = Array.isArray(data.message) ? data.message[0] : data.message;
            }
        } 
        else if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `[${request.method}] ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
            responseBody.message = 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.';
            responseBody.error = 'Internal Server Error';
        } 
        else {
            // Các lỗi 401, 403, 404...
            const messageSource = data.message || data;
            responseBody.message = messageSource[lang] || data.message || 'Lỗi không xác định';
            responseBody.error = data.error || 'Error';
        }

        // 6. Gửi dữ liệu về Client
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}