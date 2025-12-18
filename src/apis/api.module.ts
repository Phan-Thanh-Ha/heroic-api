import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { ApiCustomerModule } from './customer';
import { ApiAdminModule } from './admin';

@Module({
	imports: [
		ApiCustomerModule,
		ApiAdminModule,
	],
})

export class ApiModule {}