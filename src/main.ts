import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config';
import { AllExceptionsFilter } from './common';
import cookieParser from 'cookie-parser';
import { initSwagger } from './app.swagger';

async function bootstrap() {
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

  await app.listen(configuration().port);
  console.log(`📖 Swagger UI: http://localhost:${configuration().port}/docs`);
}
bootstrap();
