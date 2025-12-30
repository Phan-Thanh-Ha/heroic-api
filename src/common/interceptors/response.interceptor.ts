import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    constructor(private reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();
        const request = http.getRequest<Request>();
        const status = http.getResponse<Response>().statusCode;

        // 1. Lấy Message từ Decorator (nếu có)
        const decoratorMessage = this.reflector.getAllAndOverride<any>(RESPONSE_MESSAGE, [
            context.getHandler(),
            context.getClass(),
        ]);

        // 2. Xác định ngôn ngữ từ Header (mặc định là 'vi')
        const lang = (request.headers['x-language'] as string) || 'vi';

        return next.handle().pipe(
            map((data) => {
                // --- XỬ LÝ CHUẨN HOÁ MESSAGE THEO NGÔN NGỮ ---
                // Ưu tiên: Message từ data trả về > Message từ Decorator > Mặc định
                let rawMessage = (data && data.message) ? data.message : (decoratorMessage || 'Thành công');

                let finalMessage = '';
                if (typeof rawMessage === 'object' && rawMessage !== null) {
                    // Nếu là object { vi, en, cn }, lấy theo lang, nếu không có lấy 'vi'
                    finalMessage = rawMessage[lang] || rawMessage['vi'] || 'Thành công';
                } else {
                    finalMessage = rawMessage;
                }

                // --- XÂY DỰNG CẤU TRÚC RESPONSE CHUẨN ---
                const responseBody = {
                    status: 'success',
                    code: status,
                    success: true,
                    message: finalMessage,
                    data: null as any
                };

                // --- ĐÓNG GÓI DỮ LIỆU VÀO BIẾN DATA ---
                
                // Trường hợp 1: Data là Object chứa items và total (Phân trang)
                if (data && typeof data === 'object' && 'items' in data) {
                    // Loại bỏ trường message bên trong data (nếu có) để tránh dư thừa
                    const { message, ...rest } = data;
                    responseBody.data = rest;
                }
                // Trường hợp 2: Các trường hợp còn lại
                else {
                    responseBody.data = data;
                }

                return responseBody;
            }),
        );
    }
}