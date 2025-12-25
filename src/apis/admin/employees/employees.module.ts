import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { LoginRepository } from './login.repository';
import { PrismaModule } from '@prisma';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, LoginRepository],
})
export class EmployeesModule {}
