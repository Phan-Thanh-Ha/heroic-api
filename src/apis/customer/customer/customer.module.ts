import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { LoggerModule } from '@logger';
import { CustomerRepository } from './customer.repository';
import { PrismaService } from '@prisma';

@Module({
  imports: [LoggerModule],
  controllers: [CustomerController],
  providers: [CustomerService,CustomerRepository, PrismaService],
})
export class CustomerModule {}
 