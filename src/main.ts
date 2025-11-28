import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configuration } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  // Enable CORS
  app.enableCors({
		origin: '*',
	});

  await app.listen(configuration().port);
  console.log(`Server is running on port:http://localhost:${configuration().port}`);
}
bootstrap();
