import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { ApiCustomerModule } from './customer';
import { ApiAdminModule } from './admin';
import { UploadModule } from '../upload';

@Module({
	imports: [
		ApiCustomerModule,
		ApiAdminModule,
		UploadModule, // Upload module dùng chung cho cả customer và admin
	],
})

export class ApiModule {}