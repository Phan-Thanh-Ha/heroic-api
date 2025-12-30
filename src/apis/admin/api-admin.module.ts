import { Module } from '@nestjs/common';
import { LoginModule } from './auth/login/login.module';
import { EmployeesModule } from './employees/employees.module';
import { CategoryModule } from './category/category.module';

@Module({
	imports: [
		LoginModule,
		EmployeesModule,
		CategoryModule,
	],
})
export class ApiAdminModule {}

