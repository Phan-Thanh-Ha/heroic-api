import { applyDecorators } from "@nestjs/common";
import { ApiHeader, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Employee } from "../entities/employee.entity";
import { HTTP_STATUS_ENUM } from "@common";

export const ApiGetListEmployeeSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Lấy danh sách nhân viên',
        }),
        ApiHeader({
            name: 'token',
            required: true,
            schema: { type: 'string'},
        }),
        ApiQuery({ name: 'page', type: 'number', example: 1, required: false }),
        ApiQuery({ name: 'limit', type: 'number', example: 10, required: false }),
        ApiQuery({ name: 'search', type: 'string', example: 'search', required: false }),
        ApiQuery({ name: 'fromDate', type: 'string', example: '2021-01-01', required: false }),
        ApiQuery({ name: 'toDate', type: 'string', example: '2021-01-01', required: false }),
        ApiQuery({ name: 'positionId', type: 'number', example: 1, required: false }),
        ApiQuery({ name: 'departmentId', type: 'number', example: 1, required: false }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.OK,
            description: 'Danh sách nhân viên',
            // token 
            
            type: [Employee],
        }),
    );
};