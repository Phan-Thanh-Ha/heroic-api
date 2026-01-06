import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateProductDto } from "../dto/create-product.dto";
import { ProductEntity } from "../entities/product.entity";
import { HTTP_STATUS_ENUM } from "@common";

export const ApiCreateProductSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Tạo sản phẩm',
        }),
        ApiBody({ type: CreateProductDto, description: 'Thông tin sản phẩm' }), // Gắn DTO vào Swagger body
        ApiResponse({
            status: HTTP_STATUS_ENUM.CREATED,
            description: 'Tạo sản phẩm thành công',
            type: ProductEntity,
        }),
    );
}