import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppConfigModule } from './config/app';
import { PrismaModule } from './prisma/prisma.module';
import { ApiAdminModule } from './apis/admin';
import { ApiCustomerModule } from './apis/customer';
import { RequestLoggerMiddleware } from './common';

@Module({
	imports: [
		AppConfigModule, 
		PrismaModule,
		ApiAdminModule,
		ApiCustomerModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Use named wildcard param to avoid legacy path-to-regexp warning
		consumer.apply(RequestLoggerMiddleware).forRoutes({
			path: '/:path*',
			method: RequestMethod.ALL,
		});
	}
}
