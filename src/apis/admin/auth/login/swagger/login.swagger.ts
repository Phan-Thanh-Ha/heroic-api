import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { LoginEntity } from "../entities";
import { EmployeeLoginDto } from "../dto";

export const ApiLoginSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Đăng nhập',
        }),
        ApiBody({ type: EmployeeLoginDto, description: 'Thông tin đăng nhập', examples: {
            'Dữ liệu đăng nhập': {
                value: {
                    username: '261345292',
                    password: 'Heroic@123',
                }
            }
        } }),
        ApiResponse({
            status: 200,
            description: 'Đăng nhập thành công',
            type: LoginEntity,
        }),
    );
};