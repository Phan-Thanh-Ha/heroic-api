import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { HTTP_STATUS_ENUM } from "src/common/enums/http-status.enum";
import { CategoryEntity } from "../entities/category.entity";

export const ApiCategoryListSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách danh mục',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Danh sách danh mục',
            type: [CategoryEntity],
        }),
    );
};