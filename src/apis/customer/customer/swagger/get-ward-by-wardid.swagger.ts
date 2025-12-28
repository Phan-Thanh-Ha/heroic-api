import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiOperation } from "@nestjs/swagger";

export const ApiWardsFindByWardId = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy thông tin tỉnh/quận/xã của ward thông qua Id',
            description: 'Lấy thông tin tỉnh/quận/xã của ward thông qua Id',
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string' },
        }),
    );
};