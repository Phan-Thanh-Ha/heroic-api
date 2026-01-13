
// Gateway
export * from './notifications.gateway';
export { createAndEmitNotificationToAdmins } from './notifications.gateway';

// Controller (HTTP endpoints)

// Service
export * from './notifications.service';

// Repository
export * from './notifications.repository';

// Module
export * from './notifications.module';

// DTOs
export * from './dto/create-notification.dto';
export * from './dto/update-notification.dto';
export * from './dto/mark-as-read.dto';
export * from './dto/get-notifications.dto';

// Entities
export * from './entities/notification.entity';

// Interfaces
export * from './interfaces/notification.interface';

// Constants
export * from './constants/notification-events.constants';

// Swagger decorators (export từ swagger/index.ts để tránh lặp lại)
export * from './swagger';
