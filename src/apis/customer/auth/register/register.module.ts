import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { RegisterController } from './register.controller';
import { RegisterRespository } from './register.respository';
import { RegisterService } from './register.service';
import { WardsModule } from '@locations';
import { NotificationsModule } from '@socket';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    WardsModule,
    NotificationsModule, // Import để có thể inject NotificationsGateway
  ],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterRespository],
})
export class RegisterModule { }

