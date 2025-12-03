import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app';
import { PrismaModule } from './prisma/prisma.module';
import { ProvinceModule } from './apis/locations';

@Module({
	imports: [
		AppConfigModule, 
		PrismaModule,
		ProvinceModule,	
	],
})
export class AppModule {}
