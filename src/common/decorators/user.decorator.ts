import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadAdmin } from '@jwt';
import { SocketUser } from '../interfaces/socket-user.interface';

/**
 * Decorator để lấy user từ HTTP request (dùng cho REST API)
 */
export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // Trả về toàn bộ object user đã được AuthGuard gán vào request
        return request.user as JwtPayloadAdmin;
    },
);

/**
 * Decorator để lấy user từ Socket connection (dùng cho WebSocket)
 */
export const GetSocketUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): SocketUser => {
        const client = ctx.switchToWs().getClient();
        return client.data.user;
    },
);