import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

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
  // 1. Dùng Logger của NestJS nhìn cho chuyên nghiệp và đồng bộ màu sắc
  private readonly logger = new Logger('HTTP');

  use(req: any, _res: any, next: () => void) {
    const { method, originalUrl, query, body } = req;

    // --- LẤY CÁC HEADER ---
    const lang = req.headers['x-language'] || 'vi';
    const timeZone = req.headers['x-time-zone'] || 'Asia/Ho_Chi_Minh';
    
    // --- LOGIC LẤY TOKEN THÔNG MINH (HYBRID) ---
    let token = req.headers['x-access-token']; 


    // --- GÁN VÀO REQUEST ---
    req.lang = lang;
    req.timeZone = timeZone;
    req.accessToken = token; // Gán token tìm được vào

    // --- LOGGING ---
    const safeBody = maskSensitive(body);
    
    // Dùng Logger.log thay vì console.log
    this.logger.log(`[REQ] ${method} ${originalUrl}`, {
      // accessToken: token ? `${token.substring(0, 10)}...` : 'null', // Chỉ log 1 phần token cho gọn
      accessToken: token, // Hoặc log hết nếu bạn đang debug
      ip: req.ip,
      timeZone,
      lang,
      query: maskSensitive(query),
      body: safeBody,
    });

    next();
  }
}