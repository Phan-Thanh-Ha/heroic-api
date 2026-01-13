/**
 * Notification Entity
 * 
 * Entity class đại diện cho Notification trong hệ thống
 * Có thể được sử dụng với Prisma hoặc TypeORM
 */

import { INotification, NotificationType } from '../interfaces/notification.interface';

export class Notification implements INotification {
    id!: number;
    title!: string;
    message!: string;
    userId?: number;
    type?: NotificationType;
    createdBy?: number;
    createdAt!: Date | string;
    updatedAt?: Date | string;
    readAt?: Date | string;
    isRead?: boolean;

    constructor(data?: Partial<Notification>) {
        if (data) {
            Object.assign(this, data);
        }
    }

    /**
     * Mark notification as read
     */
    markAsRead(): void {
        this.isRead = true;
        this.readAt = new Date();
    }

    /**
     * Check if notification is read
     */
    isNotificationRead(): boolean {
        return this.isRead === true;
    }

    /**
     * Convert to JSON
     */
    toJSON(): INotification {
        return {
            id: this.id,
            title: this.title,
            message: this.message,
            userId: this.userId,
            type: this.type,
            createdBy: this.createdBy,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            readAt: this.readAt,
            isRead: this.isRead,
        };
    }
}
