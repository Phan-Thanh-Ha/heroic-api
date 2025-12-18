import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';

@Module({
	imports: [
		ProvinceModule,
		DistrictsModule,
		WardsModule,
		LoginModule,
		RegisterModule,
	],
})
export class ApiCustomerModule {}

