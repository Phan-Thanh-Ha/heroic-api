import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiQuery } from "@nestjs/swagger"; // Thêm ApiQuery
import { QueryWardsDto } from "../dto/query.dto";

export const ApiWardsFindByDistrictCode = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách phường/xã theo mã quận/huyện',
            description: 'Lấy danh sách phường/xã theo mã quận/huyện',
        }),
        ApiQuery({
            name: 'districtCode',
            type: 'string',
            description: 'Mã quận/huyện (Ví dụ: 593)',
            required: true,
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string' },
        }),
    );
};