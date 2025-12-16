import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

export const ApiCustomers = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách khách hàng',
        }),
    );
};