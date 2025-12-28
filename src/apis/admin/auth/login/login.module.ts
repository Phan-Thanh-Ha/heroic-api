import { JwtModule } from '@jwt';
import { LoggerModule } from '@logger';
import { MailModule, MailService } from '@mail';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { LoginController } from './login.controller';
import { LoginRepository } from './login.repository';
import { LoginService } from './login.service';
import { EmployeesModule } from '../../employees/employees.module';

@Module({
  imports: [LoggerModule, PrismaModule, JwtModule, MailModule, EmployeesModule],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
})
export class LoginModule {}
