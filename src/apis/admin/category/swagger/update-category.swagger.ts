import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { HTTP_STATUS_ENUM } from "@common";
import { Category } from "../entities/category.entity";

export const ApiUpdateCategorySwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Cập nhật danh mục',
        }),
        ApiBody({ type: UpdateCategoryDto }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Cập nhật danh mục thành công',
            type: Category,
        }),
    );
}