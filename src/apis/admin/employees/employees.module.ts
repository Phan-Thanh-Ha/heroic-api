import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { EmployeesController } from './employees.controller';
import { EmployeesRepository } from './employees.repository';
import { EmployeesService } from './employees.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
