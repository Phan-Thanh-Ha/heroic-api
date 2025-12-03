import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { APIOkSchema } from '@common';

export const ApiProvinceGetAll = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy tất cả tỉnh thành',
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string'},
        }),
    )
};