import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsRepository } from './notifications.repository';
import { JwtModule } from '@jwt';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';

@Module({
  imports: [
    JwtModule,
    LoggerModule,  // Cần cho JwtAuthGuard
    PrismaModule,  // Cần cho Repository
  ],
  providers: [
    NotificationsGateway,
    NotificationsService,
    NotificationsRepository,
  ],
  exports: [
    NotificationsGateway,
    NotificationsService,
    NotificationsRepository, // Export để có thể dùng ở module khác nếu cần
  ],
})
export class NotificationsModule {}
