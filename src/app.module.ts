import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ApiAdminModule } from './apis/admin';
import { ApiCustomerModule } from './apis/customer';
import { RequestLoggerMiddleware } from './common';
import { AppConfigModule } from './config/app';
import { LoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';
import { PassportModule } from './passport/passport.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule, providerApp } from './providers';
import { ProductModule } from './apis/customer/product/product.module';

@Module({
	imports: [
		AppConfigModule,
		PrismaModule,
		ApiAdminModule,
		ApiCustomerModule,
		ProvidersModule,
		MailModule,
		LoggerModule,
		PassportModule,
		ProductModule,
	],
	providers: [
		...providerApp,
	],
})

export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		// Use named wildcard param (no leading prefix because global prefix adds /v1)
		consumer.apply(RequestLoggerMiddleware).forRoutes({
			path: '/*path',
			method: RequestMethod.ALL,
		});
	}
}
