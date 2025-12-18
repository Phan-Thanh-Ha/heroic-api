import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Request } from 'express'; 
// Lưu ý: Cần Inject LoggerService vào constructor nếu bạn muốn ghi log lỗi 500

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    
    // Lấy HttpAdapterHost để giao tiếp với nền tảng HTTP (Express/Fastify)
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
    
    // Ghi chú: Nếu bạn cần logging chi tiết lỗi, hãy Inject LoggerService vào đây.

    catch(exception: unknown, host: ArgumentsHost): void {
        
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        
        // --- 1. Xác định Status Code ---
        const httpStatus = exception instanceof HttpException 
            ? exception.getStatus() 
            : HttpStatus.INTERNAL_SERVER_ERROR;
            
        // --- 2. Lấy Dữ liệu phản hồi thô ---
        // response thường chứa { statusCode, message, error }
        const data: any = (exception as any).response; 
        
        // --- 3. Xử lý Message và Ngôn ngữ (ưu tiên x-language, sau đó accept-language) ---
        const rawLang =
            (request.headers['x-language'] as string) ||
            (request.headers['accept-language'] as string) ||
            'vi';

        const normalized = rawLang.split(',')[0].toLowerCase();
        let lang: 'vi' | 'en' | 'cn' = 'vi';
        if (normalized.startsWith('en')) lang = 'en';
        else if (normalized.startsWith('vi')) lang = 'vi';
        else if (normalized.startsWith('zh') || normalized.startsWith('cn')) lang = 'cn';
        const rawMessage = data?.message;
        
        // Message mặc định cho lỗi hệ thống hoặc lỗi validation
        const defaultMessage = (httpStatus === HttpStatus.BAD_REQUEST) 
            ? 'Dữ liệu không hợp lệ.' 
            : 'Đã xảy ra lỗi hệ thống.';

        const message = 
            (rawMessage?.[`${lang}`]) ||
            (typeof rawMessage === 'string' ? rawMessage : undefined) ||
            (Array.isArray(rawMessage) ? rawMessage[0] : undefined) ||
            defaultMessage;

        // --- 4. Xây dựng Response Body Chuẩn API ---
        const responseBody: any = {
            statusCode: httpStatus, // Đổi tên thành statusCode cho chuẩn
            message: message,
            timestamp: new Date().toISOString(),
        };

        // --- 5. Logic xử lý lỗi cụ thể và Bảo mật ---

        if (httpStatus === HttpStatus.BAD_REQUEST && Array.isArray(data?.errors)) {
            // Lỗi Validation (400): Thêm trường 'errors'
            responseBody.error = data?.error || 'Bad Request';
            responseBody.errors = data.errors;
            
        } else if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
            // LỖI 500: Lỗi code/hệ thống. 
            // KHÔNG BAO GIỜ TRẢ VỀ DATA THÔ/STACK TRACE CHO CLIENT
            
            // Nếu bạn có LoggerService, hãy log (exception) đầy đủ ở đây
            // console.error(exception); 

            responseBody.message = 'Đã xảy ra lỗi hệ thống không xác định. Vui lòng thử lại sau.';
            responseBody.error = 'Internal Server Error';
            
        } else if (data && typeof data === 'object') {
            // Các HTTP Exception khác (401, 403, 409, 404, v.v.):
            // Gộp các thông tin khác (như trường 'error' của NestJS) vào responseBody
            responseBody.error = data?.error || (exception as any)?.name;
            
            // Xóa trường statusCode, message, path nếu nó đã có
            delete data.statusCode;
            delete data.message;
            delete data.path;
            
            Object.assign(responseBody, data);
        }

        // --- 6. Trả về response ---
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}