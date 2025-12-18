import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';
import { LoginRepository } from './login.repository';

@Module({
  imports: [LoggerModule, PrismaModule ],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
})
export class LoginModule {}
