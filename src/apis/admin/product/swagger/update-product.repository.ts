import { HTTP_STATUS_ENUM } from "@common";
import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateProductDto } from "../dto/update-product.dto";
import { ProductEntity } from "../entities/product.entity";

export const ApiUpdateProductSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Cập nhật sản phẩm',
        }),
        ApiBody({ type: UpdateProductDto }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Cập nhật sản phẩm thành công',
            type: ProductEntity,
        }),
    );
}