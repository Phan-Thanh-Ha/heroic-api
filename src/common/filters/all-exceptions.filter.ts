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

        // --- 1. Xác định Status Code ---
        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        // --- 2. Lấy Dữ liệu phản hồi thô (Exception Response) ---
        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal Server Error' };

        // Ép kiểu về object để dễ xử lý
        const data =
            typeof exceptionResponse === 'object' && exceptionResponse !== null
                ? (exceptionResponse as any)
                : { message: exceptionResponse };

        // --- 3. Xử lý Ngôn ngữ (Language) ---
        const rawLang =
            (request.headers['x-language'] as string) ||
            (request.headers['accept-language'] as string) ||
            'vi';

        const normalized = rawLang.split(',')[0].toLowerCase();
        let lang: 'vi' | 'en' | 'cn' = 'vi';
        if (normalized.startsWith('en')) lang = 'en';
        else if (normalized.startsWith('zh') || normalized.startsWith('cn')) lang = 'cn';

        // --- 4. Logic lấy Message thông minh (SỬA ĐỔI QUAN TRỌNG) ---
        
        // Trường hợp 1: data chính là object { vi, en } (Lỗi Custom từ Repo)
        // Trường hợp 2: data.message là object { vi, en }
        // Trường hợp 3: data.message là array (Lỗi Validation của NestJS)
        // Trường hợp 4: data.message là string thường
        
        const messageSource = data.message || data; // Ưu tiên data.message, nếu không có thì lấy chính data

        const defaultMessage =
            httpStatus === HttpStatus.BAD_REQUEST
                ? 'Dữ liệu không hợp lệ.'
                : 'Đã xảy ra lỗi hệ thống.';

        // Ưu tiên theo thứ tự: 
        // 1. Đúng ngôn ngữ -> 2. String gốc -> 3. Phần tử đầu của mảng (nếu là validation) -> 4. Mặc định
        const message =
            messageSource?.[lang] || 
            (typeof data.message === 'string' ? data.message : undefined) ||
            (Array.isArray(data.message) ? data.message[0] : undefined) ||
            defaultMessage;

        // --- 5. Xây dựng Response Body Chuẩn ---
        const responseBody: any = {
            statusCode: httpStatus,
            message: message,
            timestamp: new Date().toISOString(),
            path: request.url, // Thêm path để biết lỗi ở API nào
        };

        // --- 6. Xử lý chi tiết theo từng loại lỗi ---

        if (httpStatus === HttpStatus.BAD_REQUEST) {
            // Xử lý Validation Error (class-validator)
            if (Array.isArray(data.message)) {
                responseBody.error = 'Validation Error';
                responseBody.errors = data.message; // Trả về danh sách chi tiết các trường lỗi
            } else {
                responseBody.error = data.error || 'Bad Request';
            }
        } 
        else if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            // LOG LỖI 500 CHI TIẾT ĐỂ DEBUG (Không show cho Client)
            this.logger.error(
                `[${request.method}] ${request.url}`,
                exception instanceof Error ? exception.stack : String(exception),
            );
            
            // Ghi đè message cho client để bảo mật
            responseBody.message = 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.';
            responseBody.error = 'Internal Server Error';
        } 
        else {
            // Các lỗi khác (401, 403, 404...)
            responseBody.error = data.error || 'Error';
        }

        // --- 7. Trả về response ---
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}