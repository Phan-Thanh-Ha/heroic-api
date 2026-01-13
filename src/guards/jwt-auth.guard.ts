import { IS_PUBLIC_KEY, StrategyKey } from '@common';
import { LoggerService } from '@logger';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { tokenErrorTypes } from 'src/common/code-type/token/token-error.code-type';

@Injectable()
export class JwtAuthGuard extends AuthGuard([StrategyKey.JWT]) {
    constructor(
        private readonly reflector: Reflector,
        private readonly loggerService: LoggerService
    ) {
        super();
    }

    // Kiểm tra xem route có public không
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;
        return (await super.canActivate(context)) as boolean;
    }

    handleRequest(err: any, user: any, info: any) {
        if (info) {
            console.log('--- DEBUG JWT ---');
            console.log('Tên lỗi (info.name):', info?.name);
            console.log('Chi tiết (info.message):', info?.message);
        }
        if (user && !err) {
            return user;
        }

        // Mapping các loại lỗi của Passport-JWT
        const errorMapping = {
            TokenExpiredError: tokenErrorTypes().TOKEN_EXPIRED,
            JsonWebTokenError: tokenErrorTypes().TOKEN_ERROR,
            NotBeforeError: tokenErrorTypes().TOKEN_INACTIVE,
            TokenMissingError: tokenErrorTypes().TOKEN_MISSING,
        };

        const errorInfo = errorMapping[info?.name] || tokenErrorTypes().TOKEN_ERROR;

        // Log lỗi kèm theo context để dễ debug
        this.loggerService.error(JwtAuthGuard.name, info?.name || 'NoTokenError', errorInfo);

        throw err || new UnauthorizedException(errorInfo);
    }
}