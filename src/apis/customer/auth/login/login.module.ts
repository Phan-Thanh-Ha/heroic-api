import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoggerModule } from '@logger';

@Module({
  imports: [LoggerModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
