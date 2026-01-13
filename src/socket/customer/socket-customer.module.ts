import { Module } from '@nestjs/common';
// Import các module socket của customer ở đây khi cần
// import { ChatModule } from './chat/chat.module';
// import { OrdersModule } from './orders/orders.module';
// import { NotificationsModule } from './notifications/notifications.module';

@Module({
	imports: [
		// ChatModule,
		// OrdersModule,
		// NotificationsModule,
	],
})
export class SocketCustomerModule {}
