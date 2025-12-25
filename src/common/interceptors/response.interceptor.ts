import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getMetadata } from '../helpers';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const status = http.getResponse<Response>().statusCode;

        // 1. Lấy Message từ Decorator (Đang là Object {vi, en...} hoặc String)
        const decoratorMessage = this.reflector.getAllAndOverride<any>(RESPONSE_MESSAGE, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Xác định ngôn ngữ (Lấy từ Middleware đã gán vào req.lang hoặc parse lại header)
        // (Nếu bạn đã dùng Middleware ở bước trước thì dùng req.lang cho gọn)
        const lang = (request as any).lang || request.headers['x-language'] || 'vi';

        return next.handle().pipe(
            map((data) => {
                // --- BƯỚC QUAN TRỌNG NHẤT: CHUẨN HOÁ MESSAGE TRƯỚC ---
                
                // Mặc định lấy từ Decorator
                let rawMessage = decoratorMessage || 'Thành công';

                // Nếu Service có trả về message riêng -> Ưu tiên message của Service
                if (data && typeof data === 'object' && data.message) {
                    rawMessage = data.message;
                }

                // Xử lý chọn ngôn ngữ: Biến Object thành String duy nhất
                const finalMessage = (typeof rawMessage === 'object')
                    ? (rawMessage[lang] || rawMessage['vi'] || JSON.stringify(rawMessage))
                    : rawMessage;

                // -----------------------------------------------------

                // Case 1: Data null/undefined
                if (!data) return { 
                    status: 'success', 
                    code: status, 
                    success: true, 
                    message: finalMessage, // Đã là string
                    data: null 
                };

                // Case 2: Pagination [items, total]
                const isPagination = Array.isArray(data) && data.length === 2 && typeof data[1] === 'number';
                if (isPagination) {
                    const metadata = getMetadata(request, data);
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        message: finalMessage, // Đã là string
                        data: {
                            result: data[0],
                            ...metadata,
                        },
                    };
                }

                // Case 3: Array (Danh sách tỉnh thành rơi vào đây)
                if (Array.isArray(data)) {
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        message: finalMessage, // <--- ĐÃ SỬA: Dùng string đã lọc thay vì object gốc
                        data: { result: data },
                    };
                }

                // Case 4: Object
                if (typeof data === 'object') {
                    // Loại bỏ field 'message' cũ trong data để tránh dư thừa
                    const { message, result, ...rest } = data;

                    if (result !== undefined) {
                        return {
                            status: 'success',
                            code: status,
                            success: true,
                            message: finalMessage,
                            data: {
                                result: Array.isArray(result) ? result : [result],
                            },
                        };
                    }

                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        message: finalMessage,
                        data: rest,
                    };
                }

                // Case 5: Primitive
                return { 
                    status: 'success', 
                    code: status, 
                    success: true, 
                    message: finalMessage, 
                    data 
                };
            }),
        );
    }
}