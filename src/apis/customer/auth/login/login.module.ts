import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';
import { LoginRepository } from './login.repository';
import { JwtModule } from '@jwt';
import { MailModule } from '../../../../mail/mail.module';
import { EmailModule } from 'src/apis/otp/email/email.module';
import { DiscordModule } from 'src/apis/otp/discord/discord.module';

@Module({
  imports: [
    LoggerModule, 
    PrismaModule, 
    JwtModule, 
    MailModule, 
    EmailModule,
    DiscordModule,
  ],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
  exports: [LoginService],
})
export class LoginModule {}
