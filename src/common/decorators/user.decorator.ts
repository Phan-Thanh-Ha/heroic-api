import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadAdmin } from '@jwt';

export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // Trả về toàn bộ object user đã được AuthGuard gán vào request
        return request.user as JwtPayloadAdmin;
    },
);