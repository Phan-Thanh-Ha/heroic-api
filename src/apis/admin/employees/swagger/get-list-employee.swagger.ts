import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Employee } from "../entities/employee.entity";
import { HTTP_STATUS_ENUM } from "@common";

export const ApiGetListEmployeeSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách nhân viên',
        }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Danh sách nhân viên',
            type: [Employee],
        }),
    );
};