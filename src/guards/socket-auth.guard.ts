import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@jwt';
import { LoggerService } from '@logger';
import { SocketUser, IS_PUBLIC_SOCKET_KEY } from '@common';
import { tokenErrorTypes } from 'src/common/code-type/token/token-error.code-type';

@Injectable()
export class SocketAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly loggerService: LoggerService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Kiểm tra xem có @PublicSocket() decorator không
        const isPublicSocket = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_SOCKET_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Nếu là public socket, không cần authentication
        if (isPublicSocket) {
            return true;
        }

        const client: Socket = context.switchToWs().getClient<Socket>();

        try {
            // Lấy token từ query string hoặc auth object
            const token = this.extractToken(client);

            if (!token) {
                throw new WsException({
                    message: 'Token is missing',
                    code: tokenErrorTypes().TOKEN_MISSING.error_code,
                });
            }

            // Verify token - cần xác định loại token trước
            // Lấy type từ query string hoặc auth object
            const userType = this.extractUserType(client);

            let payload: any;
            try {
                if (userType === 'admin') {
                    payload = await this.jwtService.verifyJwtAdmin(token);
                } else if (userType === 'customer') {
                    payload = await this.jwtService.verifyJwtCustomer(token);
                } else {
                    // Fallback: verify trực tiếp nếu không có type
                    payload = await this.jwtService.verifyAsync(token, {
                        secret: process.env.SECRET_KEY,
                    });
                }
            } catch (error) {
                // Convert HTTP UnauthorizedException thành WsException
                if (error.name === 'UnauthorizedException') {
                    throw new WsException({
                        message: error.message || 'Token verification failed',
                        code: tokenErrorTypes().TOKEN_ERROR.error_code,
                    });
                }
                throw error;
            }

            // Validate payload và tạo SocketUser
            const user: SocketUser = this.createSocketUser(payload);

            // Inject user vào socket.data để dùng sau này
            client.data.user = user;

            return true;
        } catch (error) {
            this.loggerService.error(
                SocketAuthGuard.name,
                'Socket authentication failed',
                error,
            );

            if (error instanceof WsException) {
                throw error;
            }

            // Map JWT errors
            const errorMapping: Record<string, any> = {
                TokenExpiredError: tokenErrorTypes().TOKEN_EXPIRED,
                JsonWebTokenError: tokenErrorTypes().TOKEN_ERROR,
                NotBeforeError: tokenErrorTypes().TOKEN_INACTIVE,
            };

            const errorInfo = errorMapping[error.name] || tokenErrorTypes().TOKEN_ERROR;

            throw new WsException({
                message: errorInfo.message,
                code: errorInfo.code,
            });
        }
    }

    /**
     * Extract token từ Socket connection
     * Có thể lấy từ:
     * 1. Query string: ?token=xxx
     * 2. Auth object: auth: { token: 'xxx' }
     */
    private extractToken(client: Socket): string | null {
        // Lấy từ query string
        const tokenFromQuery = client.handshake.query.token as string;
        if (tokenFromQuery) {
            return tokenFromQuery;
        }

        // Lấy từ auth object
        const tokenFromAuth = client.handshake.auth?.token as string;
        if (tokenFromAuth) {
            return tokenFromAuth;
        }

        return null;
    }

    /**
     * Extract user type từ Socket connection
     */
    private extractUserType(client: Socket): 'admin' | 'customer' | null {
        // Lấy từ query string
        const typeFromQuery = client.handshake.query.type as string;
        if (typeFromQuery === 'admin' || typeFromQuery === 'customer') {
            return typeFromQuery;
        }

        // Lấy từ auth object
        const typeFromAuth = client.handshake.auth?.type as string;
        if (typeFromAuth === 'admin' || typeFromAuth === 'customer') {
            return typeFromAuth;
        }

        return null;
    }

    /**
     * Tạo SocketUser từ JWT payload
     */
    private createSocketUser(payload: any): SocketUser {
        // Dựa vào typeAccessToken để xác định loại user
        if (payload.typeAccessToken === 'admin') {
            return {
                ...payload,
                type: 'admin',
            } as SocketUser;
        } else if (payload.typeAccessToken === 'customer') {
            return {
                ...payload,
                id: payload.id || payload.sub,
                type: 'customer',
            } as SocketUser;
        }

        throw new WsException({
            message: 'Invalid user type',
            code: 'INVALID_USER_TYPE',
        });
    }
}
