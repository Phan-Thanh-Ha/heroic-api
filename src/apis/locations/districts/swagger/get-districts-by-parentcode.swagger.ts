import { ApiOperation } from "@nestjs/swagger/dist/decorators/api-operation.decorator"
import { ApiParam } from "@nestjs/swagger/dist/decorators/api-param.decorator"
import { applyDecorators } from "@nestjs/common"
import { ApiHeader } from "@nestjs/swagger"

export const ApiDistrictsFindByParentCode = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách quận/huyện theo mã tỉnh/thành phố',
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string' },
        }),
    )
}