import { Module } from '@nestjs/common';
import { UploadModule } from '../upload';
import { ApiAdminModule } from './admin';
import { ApiCustomerModule } from './customer';

@Module({
	imports: [
		ApiCustomerModule,
		ApiAdminModule,
		UploadModule, // Upload module dùng chung cho cả customer và admin
	],
})

export class ApiModule {}