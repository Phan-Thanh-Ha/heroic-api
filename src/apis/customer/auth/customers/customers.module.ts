import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { CustomersController } from './customers.controller';
import { CustomersRespository } from './customers.respository';
import { CustomersService } from './customers.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRespository],
  exports: [CustomersService, CustomersRespository], 
})
export class CustomersModule {}
