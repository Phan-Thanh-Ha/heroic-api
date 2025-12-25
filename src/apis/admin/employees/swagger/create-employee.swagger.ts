import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Employee } from "../entities/employee.entity";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { HTTP_STATUS_ENUM } from "@common";

export const ApiCreateEmployeeSwagger = () => {
    return applyDecorators(
        ApiOperation({
            summary: 'Tạo nhân viên',
        }),
        ApiBody({ type: CreateEmployeeDto, description: 'Thông tin nhân viên' }),
        ApiResponse({
            status: HTTP_STATUS_ENUM.CREATED,
            description: 'Tạo nhân viên thành công',
            type: Employee,
        }),
    );
};