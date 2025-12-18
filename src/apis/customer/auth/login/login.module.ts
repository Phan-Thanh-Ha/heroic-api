import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';
import { LoginRepository } from './login.repository';
import { JwtModule } from '@jwt';

@Module({
  imports: [LoggerModule, PrismaModule, JwtModule ],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
})
export class LoginModule {}
