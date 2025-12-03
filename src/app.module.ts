import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app';
import { PrismaModule } from './prisma/prisma.module';
import { ProvinceModule } from './apis/locations';
import { ApiModule } from '@apis';
@Module({
	imports: [
		AppConfigModule, 
		PrismaModule,
		ProvinceModule,
		ApiModule,
	],
})
export class AppModule {}
