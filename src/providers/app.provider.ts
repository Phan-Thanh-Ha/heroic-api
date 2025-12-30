import { 
    BadRequestException, 
    ValidationError, 
    ValidationPipe, 
    Provider,
    ClassSerializerInterceptor 
} from '@nestjs/common';
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '../common/filters/all-exceptions.filter'; 
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard'; 
import { ResponseTransformInterceptor } from '@common';

/**
 * Hàm xử lý lỗi Validation (Lỗi khi Client gửi thiếu/sai trường dữ liệu)
 * Chuyển đổi mảng lỗi phức tạp của NestJS thành Object đơn giản để Frontend dễ đọc
 */
const exceptionFactory = (errors: ValidationError[]) => {
    const result = {};

    // Hàm đệ quy để quét sâu vào các trường dữ liệu lồng nhau (Nested Objects)
    const mapErrors = (validationErrors: ValidationError[], target: any) => {
        for (const err of validationErrors) {
            // Nếu field không có lỗi trực tiếp nhưng có lỗi ở các trường con (children)
            if (!err.constraints && err.children && err.children.length > 0) {
                target[err.property] = {};
                mapErrors(err.children, target[err.property]);
            } else {
                // Nếu có lỗi tại field hiện tại, lấy câu thông báo lỗi đầu tiên
                target[err.property] = {
                    errorCode: 'VALIDATION_ERROR',
                    message: err.constraints ? Object.values(err.constraints)[0] : 'Giá trị không hợp lệ',
                };
            }
        }
    };

    mapErrors(errors, result);
    
    // Ném lỗi BadRequest kèm theo danh sách errors chi tiết
    throw new BadRequestException({ 
        errors: result, 
        message: 'Dữ liệu đầu vào không hợp lệ' 
    });
};

export const providerApp: Provider[] = [
    // Interceptor: Giúp tự động ẩn các trường nhạy cảm (như password) khi trả về dữ liệu
    {
		provide: APP_INTERCEPTOR,
		useClass: ResponseTransformInterceptor,
	},
    // Pipe: Kiểm tra tính hợp lệ của dữ liệu đầu vào dựa trên DTO
    {
        provide: APP_PIPE,
        useValue: new ValidationPipe({
            whitelist: true, // Loại bỏ các trường không được định nghĩa trong DTO
            transform: true, // Tự động chuyển đổi kiểu dữ liệu (ví dụ string sang number)
            exceptionFactory, // Sử dụng hàm định dạng lỗi tùy chỉnh ở trên
        }),
    },
    // Filter: Bộ lọc bắt mọi loại lỗi (400, 401, 500...) để trả về format chuẩn
    {
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
    },
    // Guard: Bảo vệ các route, chỉ cho phép người dùng có Token hợp lệ truy cập
    {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
    },
];