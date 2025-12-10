import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config';
import { AllExceptionsFilter } from './common';
import { BrowserProvider } from './providers';
import cookieParser from 'cookie-parser';
import { initSwagger } from './app.swagger';

async function bootstrap() {
  // Đảm bảo DATABASE_URL được set từ configuration trước khi khởi tạo app
  // const config = configuration();
  // if (config.databaseUrl && !process.env.DATABASE_URL) {
  //   process.env.DATABASE_URL = config.databaseUrl;
  // }

  const app = await NestFactory.create(AppModule);

  // xử lý prefix global với version
	app.setGlobalPrefix('/v1');

  // Cookie-parser
	app.use(cookieParser());

	// Swagger
	initSwagger(app);

  // Xử lý lỗi
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));


  // Enable CORS
  app.enableCors({
		origin: '*',
	});

  const port = configuration().port;
  await app.listen(port);
  
  const baseUrl = `http://localhost:${port}`;
  console.log(`\n📖 Swagger Documentation:`);
  console.log(`   Admin:   ${baseUrl}/docs-admin`);
  console.log(`   Website: ${baseUrl}/docs-website\n`);
  
  // Tự động mở Chrome với Swagger UI
  // const browserProvider = new BrowserProvider();
  // browserProvider.openSwagger(port);
}
bootstrap();
