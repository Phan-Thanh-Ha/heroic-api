import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, HttpException } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    // Lấy adapter host
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {

        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
		const request = ctx.getRequest<Request>();
		const lang = request.headers['accept-language'] || 'vi';

        // Lấy trạng thái từ exception
        const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        
		const data: any = (exception as any).response;
        const responseBody = {
			status: httpStatus,
            message: data?.message?.[`${lang}`] || data?.message || (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR ? 'Lỗi hệ thống' : 'Error'),
			data: data,
		};
        // Trả về response
        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
