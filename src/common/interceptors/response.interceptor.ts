import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getMetadata } from '../helpers';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const status = http.getResponse<Response>().statusCode;

        // 1. Xác định ngôn ngữ từ Header
        const rawLang = (request.headers['x-language'] as string) || 'vi';
        let lang: 'vi' | 'en' | 'cn' = 'vi';
        if (rawLang.startsWith('en')) lang = 'en';
        else if (rawLang.startsWith('zh') || rawLang.startsWith('cn')) lang = 'cn';

        return next.handle().pipe(
            map((data) => {
                // Nếu không có data (null/undefined), trả về mặc định
                if (!data) return { 
                    status: 'success', 
                    code: status, 
                    success: true, 
                    data: null 
                };

                // 2. Xử lý Pagination (Mảng 2 phần tử: [items, total])
                const isPagination = Array.isArray(data) && data.length === 2 && typeof data[1] === 'number';
                if (isPagination) {
                    const metadata = getMetadata(request, data);
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        data: {
                            result: data[0],
                            ...metadata,
                        },
                    };
                }

                // 3. Xử lý Mảng bình thường
                if (Array.isArray(data)) {
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        data: { result: data },
                    };
                }

                // 4. Xử lý Object (Single record hoặc Auth response)
                if (typeof data === 'object') {
                    const { message, result, ...rest } = data;

                    // Xử lý localized message
                    const localizedMessage =
                        (message as any)?.[lang] ??
                        (typeof message === 'string' ? message : 'Thành công');

                    // Trường hợp có field 'result' riêng biệt
                    if (result !== undefined) {
                        return {
                            status: 'success',
                            code: status,
                            success: true,
                            message: localizedMessage,
                            data: {
                                result: Array.isArray(result) ? result : [result],
                            },
                        };
                    }

                    // Trường hợp trả về object trực tiếp (Ưu tiên dùng cái này cho Clean API)
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        message: localizedMessage,
                        data: rest,
                    };
                }

                // 5. Các trường hợp primitive (string, number, boolean)
                return { status: 'success', code: status, success: true, data };
            }),
        );
    }
}