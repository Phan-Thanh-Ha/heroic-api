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

        // 1. Lấy Message từ Decorator
        const decoratorMessage = this.reflector.getAllAndOverride<any>(RESPONSE_MESSAGE, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Xác định ngôn ngữ
        const lang = (request as any).lang || request.headers['x-language'] || 'vi';

        return next.handle().pipe(
            map((data) => {
                // --- CHUẨN HOÁ MESSAGE ---
                let rawMessage = decoratorMessage || 'Thành công';

                if (data && typeof data === 'object' && data.message) {
                    rawMessage = data.message;
                }

                const finalMessage = (typeof rawMessage === 'object')
                    ? (rawMessage[lang] || rawMessage['vi'] || JSON.stringify(rawMessage))
                    : rawMessage;
                // -------------------------

                // Cấu trúc response cơ bản
                const baseResponse = {
                    status: 'success',
                    code: status,
                    success: true,
                    message: finalMessage,
                };

                // Case 1: Data null/undefined
                if (!data) {
                    return { ...baseResponse, data: null };
                }

                // --- CASE 2: PAGINATION  ---
                // Kiểm tra nếu data là mảng dạng [Data[], Count]
                const isPagination = Array.isArray(data) && data.length === 2 && typeof data[1] === 'number';
                if (isPagination) {
                    const metadata = getMetadata(request, data);
                    return {
                        ...baseResponse,
                        data: {
                            items: data[0],
                            meta: metadata
                        },
                    };
                }

                // Case 3: Array thường (Ví dụ danh sách tỉnh thành, không phân trang)
                if (Array.isArray(data)) {
                    return {
                        ...baseResponse,
                        data: { 
                            items: data 
                        },
                    };
                }

                // Case 4: Object (Create/Update/GetOne)
                if (typeof data === 'object') {
                    // Loại bỏ field 'message' trong data để tránh dư thừa (vì đã đưa lên finalMessage rồi)
                    const { message, ...rest } = data;
                    
                    return {
                        ...baseResponse,
                        data: rest, 
                    };
                }

                // Case 5: Primitive (String, Number, Boolean)
                return { 
                    ...baseResponse,
                    data: data 
                };
            }),
        );
    }
}