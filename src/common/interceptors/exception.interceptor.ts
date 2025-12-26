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

    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();

        // 1. Xác định Status Code
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // 2. Lấy nội dung lỗi thô
        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal Server Error' };

        const data =
            typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as any)
                : { message: exceptionResponse };

        // 3. Xử lý Ngôn ngữ (Giữ nguyên logic của bạn)
        const rawLang =
            (request.headers['x-language'] as string) ||
            (request.headers['accept-language'] as string) ||
            'vi';

        const normalized = rawLang.split(',')[0].toLowerCase();
        let lang: 'vi' | 'en' | 'cn' = 'vi';
        if (normalized.startsWith('en')) lang = 'en';
        else if (normalized.startsWith('zh') || normalized.startsWith('cn')) lang = 'cn';

        // 4. Logic lấy Message
        const messageSource = data.message || data;
        const defaultMessage =
            httpStatus === HttpStatus.BAD_REQUEST
                ? 'Dữ liệu không hợp lệ.'
                : 'Đã xảy ra lỗi hệ thống.';

        const message =
            messageSource?.[lang] ||
            (typeof data.message === 'string' ? data.message : undefined) ||
            (Array.isArray(data.message) ? data.message[0] : undefined) ||
            defaultMessage;

        // 5. Xây dựng Response Body
        const responseBody: any = {
            statusCode: httpStatus,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        // --- 6. Xử lý chi tiết (ĐOẠN SỬA QUAN TRỌNG NHẤT) ---
        if (httpStatus === HttpStatus.BAD_REQUEST) {
            
            // ƯU TIÊN 1: Nếu trong data có mảng 'errors' (từ ValidationProvider gửi sang)
            if (data.errors) {
                responseBody.error = 'Validation Error';
                responseBody.errors = data.errors; // <--- BẮT BUỘC PHẢI CÓ DÒNG NÀY
            }
            // ƯU TIÊN 2: Nếu message là mảng (Lỗi mặc định của NestJS)
            else if (Array.isArray(data.message)) {
                responseBody.error = 'Validation Error';
                responseBody.errors = data.message;
            } 
            // Các trường hợp khác
            else {
                responseBody.error = data.error || 'Bad Request';
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
            responseBody.error = data.error || 'Error';
        }

        // 7. Trả về Response
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}