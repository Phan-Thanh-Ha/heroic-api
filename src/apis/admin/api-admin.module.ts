import { Module } from '@nestjs/common';
import { LoginModule } from './auth/login/login.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
	imports: [
		LoginModule,
		EmployeesModule,
	],
})
export class ApiAdminModule {}

