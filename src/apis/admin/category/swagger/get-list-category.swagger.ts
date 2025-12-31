import { HTTP_STATUS_ENUM } from "@common";
import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const ApiGetListCategorySwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách danh mục',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Danh sách danh mục',
            // type: [CategoryDto],
        }),
    );
}
