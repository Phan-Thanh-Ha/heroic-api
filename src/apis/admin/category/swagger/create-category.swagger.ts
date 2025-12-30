import { HTTP_STATUS_ENUM } from "@common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateCategoryDto } from "../dto/create-category.dto";
import { Category } from "../entities/category.entity";
import { applyDecorators } from "@nestjs/common";

export const ApiCreateCategorySwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Tạo danh mục',
        }),
        ApiBody({ type: CreateCategoryDto }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.CREATED,
            description: 'Tạo danh mục thành công',
            type: Category,
        }),
    );
}