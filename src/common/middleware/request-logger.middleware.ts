import { Injectable, NestMiddleware } from '@nestjs/common';

// Mask nhanh các field nhạy cảm (password, token, secret)
const maskSensitive = (value: any) => {
  if (typeof value !== 'object' || value === null) return value;
  const cloned: any = Array.isArray(value) ? [...value] : { ...value };
  const sensitiveKeys = ['password', 'pwd', 'pass', 'token', 'secret'];

  Object.keys(cloned).forEach((key) => {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      cloned[key] = '***';
    } else {
      cloned[key] = maskSensitive(cloned[key]);
    }
  });
  return cloned;
};

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const { method, originalUrl, query, body } = req;

    // 1. LẤY GIÁ TRỊ TỪ HEADER (Sửa đúng tên khớp với Swagger)
    // Header trong Node.js luôn tự động chuyển về chữ thường (lowercase)
    const lang = req.headers['x-language'] || 'vi'; // Mặc định là 'vi'
    const timeZone = req.headers['x-time-zone'] || 'Asia/Ho_Chi_Minh'; // Sửa: x-timezone -> x-time-zone

    // 2. GÁN VÀO REQUEST (Quan Trọng)
    // Bước này giúp Controller và Interceptor sau này có thể gọi req.timeZone
    req.lang = lang;
    req.timeZone = timeZone;

    // 3. LOGGING
    const safeBody = maskSensitive(body);
    console.log('[REQ]', { 
      method,
      url: originalUrl,
      // params: req.params, // Lưu ý: Middleware chạy TRƯỚC Router nên req.params lúc này thường là {} (rỗng)
      query: query,
      body: safeBody,
      ip: req.ip,
      // userAgent: req.headers['user-agent'],
      // referer: req.headers['referer'],
      // host: req.headers['host'],
      timeZone: timeZone,
      language: lang 
    });

    next();
  }
}