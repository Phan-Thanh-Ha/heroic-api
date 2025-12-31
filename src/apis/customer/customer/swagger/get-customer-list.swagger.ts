import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { APIOkSchema } from '@common';

export const ApiCustomerGetList = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách khách hàng ',
        }),
    )
}; 