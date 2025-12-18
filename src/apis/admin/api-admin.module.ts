import { Module } from '@nestjs/common';
import { RegisterModule } from './auth/register/register.module';

@Module({
	imports: [
		RegisterModule,
	],
})
export class ApiAdminModule {}

