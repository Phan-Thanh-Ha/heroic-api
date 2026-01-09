import { Module } from '@nestjs/common';
import { ProvinceModule, DistrictsModule, WardsModule } from '@locations';
import { LoginModule } from './auth/login/login.module';
import { RegisterModule } from './auth/register/register.module';
import { UploadModule } from '../../upload/upload.module';
import { CustomerModule } from './customer/customer.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		ProvinceModule,
		DistrictsModule,
		WardsModule,
		LoginModule,
		RegisterModule,
		UploadModule,
		CustomerModule,
		CategoryModule,
		ProductModule,
	],
})
export class ApiCustomerModule {}

