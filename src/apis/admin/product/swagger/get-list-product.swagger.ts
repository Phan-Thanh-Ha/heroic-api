import { APIOkSchema, HTTP_STATUS_ENUM } from "@common";
import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ProductEntity } from "../entities/product.entity";

export const ApiGetListProductSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách sản phẩm',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Danh sách sản phẩm',
            type: [ProductEntity],
        }),
    );
}