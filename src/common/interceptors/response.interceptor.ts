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

		return next.handle().pipe(
			map((data) => {
                // 1. Nếu data là kết quả phân trang (Array 2 phần tử: [items, total])
                const isPagination = Array.isArray(data) && data.length === 2 && typeof data[1] === 'number';
				if (isPagination) {
                    const metadata = getMetadata(request, data);
					return {
                        status: 'success',
                        code: status,
						success: true,
						data: {
							result: data[0],
                            ...metadata, // total, currentPage, limit, totalPage
						},
					};
				}

                // 2. Nếu data là một Mảng bình thường (không phân trang)
                if (Array.isArray(data)) {
					return {
						status: 'success',
						code: status,
						success: true,
						data: {
                            result: data,
						},
					};
				}

                // 3. Nếu data là một Object đơn lẻ (Profile, Detail, Login, Register)
                if (data && typeof data === 'object') {
                    const { message, result, ...rest } = data;
                    
                    // Nếu có result field (format cũ: { result: [...], message: '...' })
                    if (result !== undefined) {
				return {
					status: 'success',
					code: status,
					success: true,
                            message: message || 'Thành công',
					data: {
                                result: Array.isArray(result) ? result : [result],
					},
                        };
                    }
                    
                    // Format mới: { user: {...}, accessToken: '...', message: '...' }
                    return {
                        status: 'success',
                        code: status,
                        success: true,
                        message: message || 'Thành công',
                        data: rest, // Trả về object trực tiếp, không bọc mảng
                    };
                }

                // 4. Các trường hợp còn lại (string, number, boolean)
                return {
                    status: 'success',
                    code: status,
                    success: true,
                    data,
				};
			}),
		);
	}
}
