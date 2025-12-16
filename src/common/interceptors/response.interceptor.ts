import { 
    CallHandler, 
    ExecutionContext, 
    Injectable, 
    NestInterceptor, 
    HttpStatus 
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // <-- Đã sửa lỗi: Import Reflector từ @nestjs/core
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { getMetadata } from '../helpers'; // Helper xử lý phân trang (nếu có)

// Định nghĩa cấu trúc phản hồi toàn cục
interface GlobalResponse<T> {
    status: string; // "success"
    code: number;
    message: string;
    data: T | null;
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    
    // TIÊM REFLECTOR VÀO CONSTRUCTOR để đọc metadata
    constructor(private reflector: Reflector) {} 

    // Hàm lấy thông báo mặc định dựa trên Status Code
    private getMessage(status: number): string {
        if (status === HttpStatus.CREATED) return 'Tạo thành công';
        if (status >= 200 && status < 300) return 'Thành công';
        return 'Yêu cầu hoàn tất';
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<GlobalResponse<any>> {
        const http = context.switchToHttp();
        const response = http.getResponse<Response>();
        // const request = http.getRequest<Request>(); // Không sử dụng request, có thể bỏ

        // 1. LẤY STATUS CODE CHÍNH XÁC TỪ METADATA
        const controllerStatus = this.reflector.get<number>(
            '__httpCode__',
            context.getHandler(),
        );
        
        // Status Code HTTP cuối cùng: Ưu tiên metadata, sau đó là code hiện tại (response.statusCode), mặc định 200
        const finalStatusCode = controllerStatus || response.statusCode || HttpStatus.OK; 

        return next.handle().pipe(
            map((data) => {
                
                // --- 1. Xử lý Dữ liệu rỗng ---
                if (data === undefined || data === null) {
                    return {
                        status: 'success',
                        code: finalStatusCode,
                        message: this.getMessage(finalStatusCode),
                        data: null,
                    };
                }

                const isArray = Array.isArray(data);
                
                // --- 2. Xử lý Phân trang (Pagination) ---
                // Giả định: Phân trang trả về mảng 2 phần tử: [danh sách items, tổng số items (number)]
                const isPagination = isArray && data.length === 2 && typeof data[1] === 'number';

                if (isPagination) {
                    // Logic tính toán metadata (nếu cần dùng getMetadata)
                    // const { page, total_items, total_page, limit } = getMetadata(request, data);
                    
                    return {
                        status: 'success',
                        code: finalStatusCode,
                        message: this.getMessage(finalStatusCode),
                        data: {
                            result: data[0], 
                            totalCount: data[1] // Tổng số mục
                        },
                    };
                }

                // --- 3. Xử lý Phản hồi Đơn (Đối tượng hoặc Mảng) ---
                return {
                    status: 'success',
                    code: finalStatusCode,
                    message: this.getMessage(finalStatusCode),
                    // Nếu là mảng, đóng gói vào 'result' để nhất quán
                    data: isArray ? { result: data } : data, 
                };
            }),
        );
    }
}