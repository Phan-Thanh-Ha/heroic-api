import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { INotification } from './interfaces/notification.interface';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  /**
   * Tạo notification mới
   */
  async create(createNotificationDto: CreateNotificationDto & { createdBy?: number }): Promise<INotification> {
    return await this.notificationsRepository.createNotification(createNotificationDto);
  }

  /**
   * Đánh dấu notification đã đọc
   */
  // async markAsRead(notificationId: number, userId: number): Promise<INotification> {
  //   return await this.notificationsRepository.markAsRead(notificationId, userId);
  // }

  /**
   * Lấy danh sách notifications
   */
  // async findAll(query: GetNotificationsDto & { userId: number }): Promise<{ items: INotification[]; total: number }> {
  //   return await this.notificationsRepository.findAll(query);
  // }

  /**
   * Lấy notification theo ID
   */
  // async findOne(notificationId: number, userId: number): Promise<INotification | null> {
  //   return await this.notificationsRepository.findOne(notificationId, userId);
  // }

  /**
   * Xóa notification
   */
  // async remove(notificationId: number, userId: number): Promise<boolean> {
  //   return await this.notificationsRepository.delete(notificationId, userId);
  // }

  /**
   * Đếm số notification chưa đọc
   */
  // async countUnread(userId: number): Promise<number> {
  //   return await this.notificationsRepository.countUnread(userId);
  // }

}
