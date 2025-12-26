import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config';
import { AllExceptionsFilter } from './common';
import { ValidationProvider, logSwaggerUrls } from './providers';
// import { LoggerService } from './logger'; // <-- Có thể bỏ nếu không dùng trong bootstrap
import cookieParser from 'cookie-parser';
import { initSwagger } from './app.swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // --- 1. Cấu hình Static Assets (Uploads) ---
  const uploadsPath = process.env.UPLOAD_PATH || join(process.cwd(), 'heroic-images');

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // --- 2. Cấu hình Cơ bản ---
  app.setGlobalPrefix('/v1');
  app.use(cookieParser());
  app.enableCors({ origin: '*', credentials: true });

  // --- 3. Swagger ---
  initSwagger(app);

  // --- 4. Cấu hình Global Filters & Pipes (QUAN TRỌNG) ---
  
  // Lấy HttpAdapterHost từ ứng dụng
  const httpAdapterHost = app.get(HttpAdapterHost);
  
  // Khởi tạo Filter (chỉ truyền httpAdapterHost, logger tự lo bên trong Filter)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const validationProvider = app.get(ValidationProvider);
  app.useGlobalPipes(validationProvider.createValidationPipe());

  // --- 5. Start Server ---
  const port = configuration().port || 3103;
  await app.listen(port, '0.0.0.0');

  logSwaggerUrls(port, '/docs');
}
bootstrap();