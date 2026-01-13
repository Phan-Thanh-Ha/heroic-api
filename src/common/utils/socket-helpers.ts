import { Server, Socket } from 'socket.io';
import { SocketUser } from '../interfaces/socket-user.interface';
import { createUserRoom, createRoleRoom } from '../constants/socket-room.constants';

/**
 * Join user vào room dựa trên user ID
 */
export function joinUserRoom(client: Socket, userId: string | number): void {
    client.join(createUserRoom(userId));
}

/**
 * Join user vào room dựa trên role
 */
export function joinRoleRoom(client: Socket, role: 'admin' | 'customer'): void {
    client.join(createRoleRoom(role));
}

/**
 * Emit event đến một user cụ thể
 */
export function emitToUser(
    server: Server,
    userId: string | number,
    event: string,
    data: any,
): void {
    server.to(createUserRoom(userId)).emit(event, data);
}

/**
 * Emit event đến một room cụ thể
 */
export function emitToRoom(
    server: Server,
    roomId: string,
    event: string,
    data: any,
): void {
    server.to(roomId).emit(event, data);
}

/**
 * Emit event đến tất cả users có role cụ thể
 */
export function emitToRole(
    server: Server,
    role: 'admin' | 'customer',
    event: string,
    data: any,
): void {
    server.to(createRoleRoom(role)).emit(event, data);
}

/**
 * Emit event đến tất cả clients đã kết nối
 */
export function emitToAll(server: Server, event: string, data: any): void {
    server.emit(event, data);
}

/**
 * Lấy user từ socket client
 */
export function getUserFromSocket(client: Socket): SocketUser | null {
    return client.data.user || null;
}
