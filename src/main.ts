import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config';
import { AllExceptionsFilter } from './common';
import { ValidationProvider, logSwaggerUrls } from './providers';
import { LoggerService } from './logger';
import cookieParser from 'cookie-parser';
import { initSwagger } from './app.swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Lấy đường dẫn từ env hoặc mặc định là ./heroic-images
  const uploadsPath = process.env.UPLOAD_PATH || join(process.cwd(), 'heroic-images');

  // Đảm bảo thư mục luôn tồn tại để không bị lỗi khi chạy
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  // Cấu hình Static Assets để xem ảnh từ Browser
  // Ví dụ: http://localhost:3103/v1/uploads/image.jpg
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.setGlobalPrefix('/v1');
  app.use(cookieParser());
  initSwagger(app);

  const httpAdapter = app.get(HttpAdapterHost);
  const logger = app.get(LoggerService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));
  const validationProvider = app.get(ValidationProvider);
  app.useGlobalPipes(validationProvider.createValidationPipe());

  app.enableCors({ origin: '*', credentials: true });

  const port = configuration().port || 3103;
  await app.listen(port, '0.0.0.0');

  logSwaggerUrls(port, { admin: '/docs-admin', customer: '/docs-customer' });
}
bootstrap();