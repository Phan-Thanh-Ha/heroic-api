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

/**
 * Log đơn giản request method, url, query, body để debug nhanh.
 * Lưu ý: chỉ nên bật ở dev, tránh log dữ liệu nhạy cảm ở prod.
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    const { method, originalUrl, query, body } = req;
    const safeBody = maskSensitive(body);
    console.log('[REQ]', { 
      method,
      url: originalUrl,
      params: JSON.stringify(req.params),
      query: JSON.stringify(query),
      body: JSON.stringify(safeBody),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers['referer'],
      host: req.headers['host'],
    });
    next();
  }
}

