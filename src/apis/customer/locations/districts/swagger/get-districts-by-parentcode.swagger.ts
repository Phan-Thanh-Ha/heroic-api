import { ApiOperation } from "@nestjs/swagger/dist/decorators/api-operation.decorator"
import { ApiParam } from "@nestjs/swagger/dist/decorators/api-param.decorator"
import { applyDecorators } from "@nestjs/common"
import { ApiHeader, ApiQuery } from "@nestjs/swagger"

export const ApiDistrictsFindByParentCode = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách quận/huyện theo mã tỉnh/thành phố',
        }),
        ApiQuery({
            name: 'provinceCode',
            type: 'string',
            description: 'Mã tỉnh/thành phố',
            required: true,
        }),
    )
}