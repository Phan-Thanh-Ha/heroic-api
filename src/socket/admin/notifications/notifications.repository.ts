import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { LoggerService } from '@logger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { INotification } from './interfaces/notification.interface';

@Injectable()
export class NotificationsRepository {
  private context = NotificationsRepository.name;

  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Tạo notification mới
   */
  async createNotification(
    createNotificationDto: CreateNotificationDto & { createdBy?: number },
  ): Promise<INotification> {
    try {
      // TODO: Uncomment khi đã có model Notification trong Prisma và chạy migration
      // const { generateUUID } = await import('@common');
      // const notification = await this.prisma.notification.create({
      //   data: {
      //     uuid: generateUUID(),
      //     title: createNotificationDto.title,
      //     message: createNotificationDto.message,
      //     userId: createNotificationDto.userId, // null = gửi đến tất cả admin
      //     type: createNotificationDto.type || 'info',
      //     createdById: createNotificationDto.createdBy,
      //     customerId: createNotificationDto.customerId,
      //     customerCode: createNotificationDto.customerCode,
      //     isRead: false,
      //   },
      // });
      // return notification;

      // Temporary: Return mock data cho đến khi có Prisma model
      const notification = {
        id: Date.now(),
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        userId: createNotificationDto.userId,
        type: createNotificationDto.type as any,
        createdBy: createNotificationDto.createdBy || 0,
        customerId: createNotificationDto.customerId,
        customerCode: createNotificationDto.customerCode,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      return notification;
    } catch (error) {
      this.logger.error(this.context, 'createNotification', error);
      throw error;
    }
  }

  /**
   * Đánh dấu notification đã đọc
   */
  async markAsRead(notificationId: number, userId: number): Promise<INotification> {
    try {
      // TODO: Uncomment khi đã có model Notification trong Prisma
      // const notification = await this.prisma.notification.update({
      //   where: {
      //     id: notificationId,
      //     userId, // Đảm bảo chỉ user sở hữu mới đánh dấu được
      //   },
      //   data: {
      //     isRead: true,
      //     readAt: new Date(),
      //   },
      // });

      // Temporary: Return mock data
      const notification = {
        id: notificationId,
        title: 'Test',
        message: 'Test message',
        userId,
        createdAt: new Date().toISOString(),
        readAt: new Date().toISOString(),
        isRead: true,
      };

      return notification;
    } catch (error) {
      this.logger.error(this.context, 'markAsRead', error);
      throw error;
    }
  }

  /**
   * Lấy danh sách notifications
   */
  async findAll(
    query: GetNotificationsDto & { userId: number },
  ): Promise<{ items: INotification[]; total: number }> {
    try {
      const { page = 1, limit = 10, userId, isRead } = query;

      // TODO: Uncomment khi đã có model Notification trong Prisma
      // const [notifications, total] = await Promise.all([
      //   this.prisma.notification.findMany({
      //     where: {
      //       userId,
      //       isRead: isRead !== undefined ? isRead : undefined,
      //     },
      //     skip: (page - 1) * limit,
      //     take: limit,
      //     orderBy: { createdAt: 'desc' },
      //   }),
      //   this.prisma.notification.count({
      //     where: {
      //       userId,
      //       isRead: isRead !== undefined ? isRead : undefined,
      //     },
      //   }),
      // ]);

      // Temporary: Return mock data
      return {
        items: [],
        total: 0,
      };
    } catch (error) {
      this.logger.error(this.context, 'findAll', error);
      throw error;
    }
  }

  /**
   * Lấy notification theo ID
   */
  // async findOne(notificationId: number, userId: number): Promise<INotification | null> {
  //   try {
  //     // TODO: Uncomment khi đã có model Notification trong Prisma
  //     // return await this.prisma.notification.findFirst({
  //     //   where: {
  //     //     id: notificationId,
  //     //     userId,
  //     //   },
  //     // });

  //     return null;
  //   } catch (error) {
  //     this.logger.error(this.context, 'findOne', error);
  //     throw error;
  //   }
  // }

  /**
   * Xóa notification
   */
  // async delete(notificationId: number, userId: number): Promise<boolean> {
  //   try {
  //     // TODO: Uncomment khi đã có model Notification trong Prisma
  //     // await this.prisma.notification.delete({
  //     //   where: {
  //     //     id: notificationId,
  //     //     userId,
  //     //   },
  //     // });

  //     return true;
  //   } catch (error) {
  //     this.logger.error(this.context, 'delete', error);
  //     throw error;
  //   }
  // }

  /**
   * Đếm số notification chưa đọc
   */
  // async countUnread(userId: number): Promise<number> {
  //   try {
  //     // TODO: Uncomment khi đã có model Notification trong Prisma
  //     // return await this.prisma.notification.count({
  //     //   where: {
  //     //     userId,
  //     //     isRead: false,
  //     //   },
  //     // });

  //     return 0;
  //   } catch (error) {
  //     this.logger.error(this.context, 'countUnread', error);
  //     throw error;
  //   }
  // }
}
