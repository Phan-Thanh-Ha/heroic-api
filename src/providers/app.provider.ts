import { BadRequestException, ClassSerializerInterceptor, Provider, ValidationError, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AllExceptionsFilter, ResponseTransformInterceptor } from '@common';
import { JwtAuthGuard } from '@guards';


const exceptionFactory = (errors: ValidationError[]) => {
    // Khởi tạo object kết quả
    const result = {};

    // Hàm đệ quy để duyệt tất cả các nhánh lỗi
    const mapErrors = (validationErrors: ValidationError[], target: any) => {
        for (const err of validationErrors) {
            // Nếu không có constraints nhưng có children => Tiếp tục đào sâu
            if (!err.constraints && err.children && err.children.length > 0) {
                target[err.property] = {}; // Tạo object rỗng để chứa lỗi con
                mapErrors(err.children, target[err.property]);
            } else {
                // Nếu có lỗi ở cấp hiện tại
                target[err.property] = {
                    errorCode: 'BAD_REQUEST',
                    message: err.constraints ? Object.values(err.constraints)[0] : 'Invalid value',
                };
            }
        }
    };

    mapErrors(errors, result);
    
    // Ném lỗi với object kết quả hoàn chỉnh
    throw new BadRequestException(result);
};
// provider áp dụng cho toàn App (global)
export const providerApp: Provider[] = [
	// serialize data
	{
		provide: APP_INTERCEPTOR,
		useClass: ClassSerializerInterceptor,
	},
	// trả về response chuẩn
	{
		provide: APP_INTERCEPTOR,
		useClass: ResponseTransformInterceptor,
	},
	// kiểm tra dữ liệu input và trả về lỗi nếu không hợp lệ
	{
		provide: APP_PIPE,
		useValue: new ValidationPipe({
			exceptionFactory,
		}),
	},
	// filter lỗi http exception
	{
		provide: APP_FILTER,
		useClass: AllExceptionsFilter,
	},
	// guard jwt auth
	{
		provide: APP_GUARD,
		useClass: JwtAuthGuard,
	},
];


