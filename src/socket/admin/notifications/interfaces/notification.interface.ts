/**
 * Notification Interface
 * 
 * Định nghĩa cấu trúc dữ liệu cho Notification
 */

export interface INotification {
    id: number;
    title: string;
    message: string;
    userId?: number;
    type?: NotificationType;
    createdBy?: number;
    createdAt: Date | string;
    updatedAt?: Date | string;
    readAt?: Date | string;
    isRead?: boolean;
    customerId?: number;
    customerCode?: string;
}

export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    SYSTEM = 'system',
}

export interface NotificationResponse {
    event: string;
    data: INotification;
    timestamp: string;
}

export interface ConnectionSuccessResponse {
    event: 'connected';
    message: string;
    userId: number;
    userType: 'admin' | 'customer';
    timestamp: string;
}
