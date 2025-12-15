import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs/operators';

/**
 * Log response body và thời gian xử lý.
 * Lưu ý: tránh log dữ liệu nhạy cảm ở prod.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const { method, originalUrl } = req;
    const started = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const ms = Date.now() - started;
        console.log('[RES]', { method, url: originalUrl, ms, body: data });
      }),
    );
  }
}

