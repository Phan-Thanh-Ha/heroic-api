import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";

export const ApiWardsFindByDistrictCode = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách phường/xã theo mã quận/huyện',
            description: 'Lấy danh sách phường/xã theo mã quận/huyện',
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string' },
        }),
    );
};