import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getMetadata } from '../helpers'; // Giả định helper này tồn tại
import { ResponseFormat } from '../interfaces';


@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat> {
        const http = context.switchToHttp();
        const response = http.getResponse<Response>();
        const request = http.getRequest<Request>();
        
        // Lấy status code hiện tại (ví dụ: 200 OK, 201 Created)
        const status = response.statusCode; 

        return next.handle().pipe(
            map((data) => {
                // 1. Xử lý dữ liệu rỗng (Null/Undefined)
                if (data === undefined || data === null) {
                    // Trả về phản hồi rỗng (thường là 204 No Content), NestJS tự xử lý status code 
                    // hoặc trả về 200 OK với data: null/[]
                    return {
                        status,
                        data: null,
                    };
                }

                const isArray = Array.isArray(data);
                
                // 2. Kiểm tra Phân trang (Pagination)
                // Phân trang được định nghĩa là một mảng 2 phần tử: [danh sách items, tổng số items (number)]
                const isPagination = isArray && data.length === 2 && typeof data[1] === 'number';

                if (isPagination) {
                    const { page, total_items, total_page, limit } = getMetadata(request, data);
                    
                    // Trả về định dạng phân trang chi tiết
                    return {
                        status: HttpStatus.OK, // Thường là 200 OK cho phân trang
                        data: {
                            // Dữ liệu danh sách
                            result: data[0], 
                            // Metadata phân trang
                            page,
                            limit,
                            totalItems: total_items, // Tên trường nhất quán hơn
                            totalPages: total_page, // Tên trường nhất quán hơn
                        },
                    };
                }

                // 3. Trường hợp phản hồi bình thường (Không phân trang)
                return {
                    status,
                    data: isArray ? { result: data } : data, 
                    // Nếu là danh sách, đóng gói vào { result: [...] }
                    // Nếu là đối tượng đơn, trả về trực tiếp { status, data: { ...object } }
                };
            }),
        );
    }
}