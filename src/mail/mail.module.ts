import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { LoggerModule } from 'src/logger/logger.module';
import { MailController } from './mail.controller';
import { MailRepository } from './mail.repository';
import { MailService } from './mail.service';
import { EmailRendererService } from './email-renderer.service';

@Module({
	imports: [
		LoggerModule,
		PrismaModule,
	],
  controllers: [MailController],
	providers: [MailService, MailRepository, EmailRendererService],
	exports: [MailService],
})
export class MailModule {}
