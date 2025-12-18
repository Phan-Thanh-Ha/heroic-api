import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { CreateAdminRegisterDto } from "../../dto/create-register.dto";
import { ROUTER_TAG_ENUM } from "@common";

export const ApiRegister = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Đăng ký tài khoản nhân viên',
        }),
        ApiBody({ type: CreateAdminRegisterDto }),
    );
};

