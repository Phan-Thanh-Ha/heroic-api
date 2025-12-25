import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. Lấy thông tin Context (Tên Class, Tên Function)
    const className = context.getClass().name;
    const handlerName = context.getHandler().name; // Ví dụ: 'loginWithGoogle'
    
    // 2. Log Input (Thay thế dòng logger.log đầu hàm của bạn)
    const request = context.switchToHttp().getRequest();
    // this.logger.log(`[${className}] ${handlerName} - Input:`, request.body); 
    // (Cẩn thận log body nếu chứa password, nên filter trước khi log)

    const now = Date.now();

    return next.handle().pipe(
      // 3. Log Success (Tự động chạy sau khi service return thành công)
      tap(() => {
        const time = Date.now() - now;
        this.logger.log(`[${className}.${handlerName}] Success (+${time}ms)`);
      }),
      
      // 4. Log Error (Thay thế block catch của bạn)
      catchError((error) => {
        const time = Date.now() - now;
        this.logger.error(`[${className}.${handlerName}] Failed (+${time}ms) - Error: ${error.message}`, error.stack);
        return throwError(() => error); // Ném lỗi ra để Global Filter xử lý tiếp
      }),
    );
  }
}