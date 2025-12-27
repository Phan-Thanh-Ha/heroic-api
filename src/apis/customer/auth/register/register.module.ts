import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { RegisterController } from './register.controller';
import { RegisterRespository } from './register.respository';
import { RegisterService } from './register.service';

import { WardsModule } from '@locations';

@Module({
  imports: [LoggerModule, PrismaModule, WardsModule],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRespository],
})
export class RegisterModule { }

