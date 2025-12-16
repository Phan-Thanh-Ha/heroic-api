import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { RegisterModule } from './auth/register/register.module';
import { CustomersModule } from './auth/customers/customers.module';

@Module({
	imports: [
		ProvinceModule,
		DistrictsModule,
		WardsModule,
		RegisterModule,
		CustomersModule,
	],
})
export class ApiCustomerModule {}

