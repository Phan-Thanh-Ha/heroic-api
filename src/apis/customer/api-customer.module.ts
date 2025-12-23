import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { UploadModule } from '../../upload/upload.module';

@Module({
	imports: [
		ProvinceModule,
		DistrictsModule,
		WardsModule,
		LoginModule,
		RegisterModule,
		UploadModule,
	],
})
export class ApiCustomerModule {}

