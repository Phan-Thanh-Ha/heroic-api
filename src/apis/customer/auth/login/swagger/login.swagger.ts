import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginDto } from "../dto/login.dto";
import { Login } from "../entities/login.entity";

export const ApiLogin = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Đăng nhập',
        }),
        ApiBody({ type: LoginDto }),
        ApiResponse({
            status: 200,
            description: 'Đăng nhập thành công',
            type: Login,
        }),
    );
};