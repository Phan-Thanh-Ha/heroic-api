import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
// Import các module socket khác của admin ở đây khi cần
// import { OrdersModule } from './orders/orders.module';
// import { DashboardModule } from './dashboard/dashboard.module';

@Module({
	imports: [
		NotificationsModule,
		// OrdersModule,
		// DashboardModule,
	],
})
export class SocketAdminModule {}
