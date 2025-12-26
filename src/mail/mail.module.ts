import { Module } from '@nestjs/common';
import { PrismaModule } from '@prisma';
import { LoggerModule } from '@logger';

import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { EmailRendererService } from './email-renderer.service';
import { MailRepository } from './mail.repository';

@Module({
    imports: [
        LoggerModule,
        PrismaModule,
    ],
    controllers: [MailController],
    providers: [
        MailService, 
        MailRepository, 
        EmailRendererService
    ],
    exports: [MailService],
})
export class MailModule {}