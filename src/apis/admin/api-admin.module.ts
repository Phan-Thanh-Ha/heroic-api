import { Module } from '@nestjs/common';
import { RegisterModule } from './auth/register/register.module';
import { LoginModule } from './auth/login/login.module';

@Module({
	imports: [
		RegisterModule,
		LoginModule,
	],
})
export class ApiAdminModule {}

