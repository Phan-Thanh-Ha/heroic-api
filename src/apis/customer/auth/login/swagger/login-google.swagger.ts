import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginGoogleDto } from "../dto/login-google.dto";

export const ApiLoginWithGoogle = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Đăng nhập với Google',
        }),
        ApiBody({ type: LoginGoogleDto }),
        ApiResponse({
            status: 200,
            description: 'Đăng nhập với Google thành công',
        }),
    );
};