import { createCustomRoom, createRoleRoom, emitToUser as emitToUserHelper, GetSocketUser, joinRoleRoom, joinUserRoom, SocketUser, WS_ROUTES } from '@common';
import { socketConfig } from '@config';
import { SocketAuthGuard } from '@guards';
import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
} from './constants/notification-events.constants';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ConnectionSuccessResponse, INotification, NotificationResponse } from './interfaces/notification.interface';
import { NotificationsService } from './notifications.service';


@WebSocketGateway({
  ...socketConfig(),
  namespace: WS_ROUTES.ADMIN.NOTIFICATIONS,
})
@UseGuards(SocketAuthGuard)
export class NotificationsGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly notificationsService: NotificationsService) { }

  /**
   * Xử lý khi client kết nối
   */
  handleConnection(@ConnectedSocket() client: Socket) {
    const user: SocketUser = client.data.user;

    if (user) {
      // Join vào room của user để nhận notifications riêng
      joinUserRoom(client, user.id);
      // Join vào room của role (admin)
      joinRoleRoom(client, user.type);

      // Gửi welcome message để test connection
      const connectionResponse: ConnectionSuccessResponse = {
        event: 'connected',
        message: 'Connected to Notifications Gateway',
        userId: user.id,
        userType: user.type,
        timestamp: new Date().toISOString(),
      };
      client.emit(SERVER_EVENTS.CONNECTION_SUCCESS, connectionResponse);
    } else {
      console.error(`[Notifications] User not found in client.data.user`);
    }
  }

  /**
   * Xử lý khi client ngắt kết nối
   */
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const user: SocketUser = client.data.user;
    console.log(`[Notifications] Client disconnected: ${client.id}, User: ${user?.id}`);
  }

  /**
   * Client join vào một room cụ thể
   */
  @SubscribeMessage(CLIENT_EVENTS.JOIN_ROOM)
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @GetSocketUser() user: SocketUser,
    @MessageBody() roomId: string,
  ) {
    const roomName = createCustomRoom(roomId);
    client.join(roomName);
    console.log(`[Notifications] User ${user.id} joined room: ${roomName}`);

    // Emit response để Postman nhận được
    client.emit(SERVER_EVENTS.JOIN_ROOM_RESPONSE, {
      event: 'joined',
      room: roomId,
      user: user.id,
      timestamp: new Date().toISOString()
    });

    return { event: 'joined', room: roomId, user: user.id };
  }

  /**
   * Client leave một room
   */
  @SubscribeMessage(CLIENT_EVENTS.LEAVE_ROOM)
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @GetSocketUser() user: SocketUser,
    @MessageBody() roomId: string,
  ) {
    const roomName = createCustomRoom(roomId);
    client.leave(roomName);
    console.log(`[Notifications] User ${user.id} left room: ${roomName}`);

    // Emit response để Postman nhận được
    client.emit(SERVER_EVENTS.LEAVE_ROOM_RESPONSE, {
      event: 'left',
      room: roomId,
      user: user.id,
      timestamp: new Date().toISOString()
    });

    return { event: 'left', room: roomId };
  }

  /**
   * Client gửi notification
   */
  @SubscribeMessage(CLIENT_EVENTS.SEND_NOTIFICATION)
  async handleSendNotification(
    @MessageBody() data: CreateNotificationDto & { userId?: string | number },
    @GetSocketUser() user: SocketUser,
    @ConnectedSocket() client: Socket,
  ) {
    const notification = await this.notificationsService.create({
      ...data,
      createdBy: user.id,
    });

    const notificationData = {
      ...notification,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Emit đến user cụ thể nếu có userId
    if (data.userId) {
      emitToUserHelper(this.server, data.userId, SERVER_EVENTS.NEW_NOTIFICATION, notificationData);
    } else {
      // Emit đến tất cả admin nếu không có userId cụ thể
      const roleRoom = createRoleRoom('admin');
      this.server.to(roleRoom).emit(SERVER_EVENTS.NEW_NOTIFICATION, notificationData);
    }

    // Emit response trực tiếp cho client gửi request
    const response: NotificationResponse = {
      event: 'notification-sent',
      data: notificationData,
      timestamp: new Date().toISOString(),
    };
    client.emit(SERVER_EVENTS.SEND_NOTIFICATION_RESPONSE, response);

    return { event: 'notification-sent', data: notification };
  }

  /**
   * Client đánh dấu notification đã đọc
   */
  // @SubscribeMessage(CLIENT_EVENTS.MARK_AS_READ)
  // async handleMarkAsRead(
  //   @MessageBody() data: MarkAsReadDto,
  //   @GetSocketUser() user: SocketUser,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const notification = await this.notificationsService.markAsRead(data.notificationId, user.id);

  //   client.emit(SERVER_EVENTS.NOTIFICATION_UPDATED, {
  //     event: 'notification-updated',
  //     data: notification,
  //     timestamp: new Date().toISOString(),
  //   });

  //   return { success: true, notification };
  // }

  /**
   * Client lấy danh sách notifications
   */
  // @SubscribeMessage(CLIENT_EVENTS.GET_NOTIFICATIONS)
  // async handleGetNotifications(
  //   @MessageBody() data: GetNotificationsDto,
  //   @GetSocketUser() user: SocketUser,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const notifications = await this.notificationsService.findAll({
  //     ...data,
  //     userId: data.userId || user.id,
  //   });

  //   client.emit(SERVER_EVENTS.NOTIFICATIONS_LIST, {
  //     event: 'notifications-list',
  //     data: notifications,
  //     timestamp: new Date().toISOString(),
  //   });

  //   return { success: true, notifications };
  // }


  /**
   * Method helper để emit notification từ service khác
   */
  emitToUser(userId: string | number, event: string, data: any) {
    emitToUserHelper(this.server, userId, event, data);
  }

  /**
   * Method helper để emit notification đến room
   */
  emitToRoom(roomId: string, event: string, data: any) {
    this.server.to(`room:${roomId}`).emit(event, data);
  }

  /**
   * Method helper để emit notification đến tất cả admin
   */
  emitToAllAdmins(event: string, data: any) {
    const roleRoom = createRoleRoom('admin');
    this.server.to(roleRoom).emit(event, data);
  }

  /**
   * Method helper để emit notification đến user cụ thể
   */
  emitNotificationToUser(userId: string | number, notification: any) {
    emitToUserHelper(this.server, userId, SERVER_EVENTS.NEW_NOTIFICATION, notification);
  }

  /**
   * Method helper để emit notification đến room cụ thể
   */
  emitNotificationToRoom(roomId: string, notification: any) {
    const roomName = createCustomRoom(roomId);
    this.server.to(roomName).emit(SERVER_EVENTS.NEW_NOTIFICATION, notification);
  }

  /**
   * Method helper để emit notification đến tất cả admin (dùng từ service khác)
   * Public method để có thể gọi từ HTTP services
   */
  emitNotificationToAllAdmins(notification: any) {
    const roleRoom = createRoleRoom('admin');
    this.server.to(roleRoom).emit(SERVER_EVENTS.NEW_NOTIFICATION, notification);
  }
}

/**
 * Helper function để tạo và emit notification đến tất cả admin
 * Luồng: Lưu vào database trước → Sau đó emit qua socket
 * 
 * @param notificationsService - NotificationsService instance
 * @param notificationsGateway - NotificationsGateway instance
 * @param createNotificationDto - DTO để tạo notification
 */
export async function createAndEmitNotificationToAdmins(
  notificationsService: NotificationsService,
  notificationsGateway: NotificationsGateway,
  createNotificationDto: CreateNotificationDto & { createdBy?: number },
): Promise<INotification> {
  // Bước 1: Lưu notification vào database
  const notification = await notificationsService.create(createNotificationDto);

  // Bước 2: Emit qua socket đến tất cả admin
  try {
    notificationsGateway.emitNotificationToAllAdmins(notification);
  } catch (error) {
    // Log lỗi nhưng không throw để không ảnh hưởng đến việc lưu database
    console.error('Error emitting notification to admins:', error);
  }

  return notification;
}
