import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginFacebookDto } from "../dto/login-facebook.dto";
import { HTTP_STATUS_ENUM } from "src/common/enums/http-status.enum";

export const ApiLoginWithFacebook = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Đăng nhập với Facebook',
        }),
        ApiBody({ type: LoginFacebookDto }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Đăng nhập với Facebook thành công',
        }),
    );
};