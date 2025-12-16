import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppConfigModule } from './config/app';
import { PrismaModule } from './prisma/prisma.module';
import { ApiAdminModule } from './apis/admin';
import { ApiCustomerModule } from './apis/customer';
import { RequestLoggerMiddleware } from './common';
import { ProvidersModule, providerApp } from './providers';

@Module({
	imports: [
		AppConfigModule, 
		PrismaModule,
		ApiAdminModule,
		ApiCustomerModule,
		ProvidersModule,
	],
	providers: [...providerApp],
})
export class AppModule {}
// export class AppModule implements NestModule {
// 	configure(consumer: MiddlewareConsumer) {
// 		// Use named wildcard param (no leading prefix because global prefix adds /v1)
// 		consumer.apply(RequestLoggerMiddleware).forRoutes({
// 			path: '/*path',
// 			method: RequestMethod.ALL,
// 		});
// 	}
// }
