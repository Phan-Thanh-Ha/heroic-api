import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { CustomersModule } from '../customers/customers.module';
import { RegisterController } from './register.controller';
import { RegisterRespository } from './register.respository';
import { RegisterService } from './register.service';

@Module({
  imports: [LoggerModule, PrismaModule,CustomersModule],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRespository],
})
export class RegisterModule { }
