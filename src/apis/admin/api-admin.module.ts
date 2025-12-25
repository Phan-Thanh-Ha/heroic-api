import { Module } from '@nestjs/common';
import { RegisterModule } from './auth/register/register.module';
import { LoginModule } from './auth/login/login.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
	imports: [
		RegisterModule,
		LoginModule,
		EmployeesModule,
	],
})
export class ApiAdminModule {}

