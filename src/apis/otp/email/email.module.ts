import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailRepository } from './email.repository';
import { MailModule } from '@mail';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';

@Module({
  imports: [
    MailModule,
    LoggerModule,
    PrismaModule,
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
  exports: [EmailService],
})
export class EmailModule {}
