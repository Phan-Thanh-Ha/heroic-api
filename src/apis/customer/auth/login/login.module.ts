import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { LoggerModule } from '../../../../logger';
import { PrismaModule } from '../../../../prisma';
import { LoginRepository } from './login.repository';
import { MailModule } from '../../../../mail/mail.module';
import { EmailModule } from '../../../../apis/otp/email/email.module';
import { DiscordModule } from '../../../../apis/otp/discord/discord.module';
import { TelegramModule } from '../../../../apis/otp/telegram/telegram.module';
import { NotificationsModule } from '../../../../socket';
import { JwtModule } from '../../../../jwt/index';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    JwtModule,
    MailModule,
    EmailModule,
    DiscordModule,
    TelegramModule,
    NotificationsModule, // Import để có thể inject NotificationsGateway
  ],
  controllers: [LoginController],
  providers: [LoginService, LoginRepository],
  exports: [LoginService],
})
export class LoginModule { }
