import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { ApiCustomerModule } from './customer';

@Module({
	imports: [
		ApiCustomerModule,
	],
})

export class ApiModule {}