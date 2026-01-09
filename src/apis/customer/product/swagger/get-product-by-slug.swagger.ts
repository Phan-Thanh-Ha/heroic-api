import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HTTP_STATUS_ENUM } from "@common";
import { ProductEntity } from "src/apis/admin/product/entities/product.entity";

export const ApiGetProductBySlug = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy sản phẩm theo slug',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Lấy sản phẩm theo slug thành công',
            type: ProductEntity,
        }),
    );
}