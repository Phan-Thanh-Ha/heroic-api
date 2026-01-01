import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Category } from "../entities/category.entity";
import { HTTP_STATUS_ENUM } from "@common";

export const ApiToggleCategorySwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Mở đóng danh mục',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Mở đóng danh mục thành công',
            type: Category,
        }),
    );
};