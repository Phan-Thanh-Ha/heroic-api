import { Module } from '@nestjs/common';
import { LoginModule } from './auth/login/login.module';
import { EmployeesModule } from './employees/employees.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
	imports: [
		LoginModule,
		EmployeesModule,
		CategoryModule,
		ProductModule,
	],
})
export class ApiAdminModule {}

