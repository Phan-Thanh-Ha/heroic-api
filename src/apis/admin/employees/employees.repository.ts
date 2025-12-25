import { BadRequestException, Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "@prisma";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { generateUUID, generateHashedDefaultPassword } from "@utils";
import { adminAuthErrorTypes } from "@common"; // File chứa định nghĩa lỗi

@Injectable()
export class EmployeesRepository {

    constructor(
        private readonly loggerService: LoggerService,
        private readonly prisma: PrismaService,
    ) { }


    //#region Tạo nhân viên
    async createEmployee(createEmployeeDto: CreateEmployeeDto) {
        const existingEmployee = await this.prisma.employee.findFirst({
            where: {
                OR: [
                    { code: createEmployeeDto.employeeCode },
                    { email: createEmployeeDto.email }
                ]
            },
            select: { code: true, email: true }
        });

        if (existingEmployee) {
            if (existingEmployee.code === createEmployeeDto.employeeCode) {
                throw new BadRequestException(adminAuthErrorTypes().AUTH_EMPLOYEE_CODE_EXISTS);
            }
            if (existingEmployee.email === createEmployeeDto.email) {
                throw new BadRequestException(adminAuthErrorTypes().AUTH_EMPLOYEE_EMAIL_EXISTS);
            }
        }

        const passwordHashed = await generateHashedDefaultPassword();

        // 2. Chuẩn bị dữ liệu
        const insertData = {
            fullName: createEmployeeDto.fullName,
            email: createEmployeeDto.email,
            phoneNumber: createEmployeeDto.phoneNumber,
            identity_number: createEmployeeDto.identityNumber,
            uuid: generateUUID(),
            password: passwordHashed,
            code: createEmployeeDto.employeeCode, 
            dob: createEmployeeDto.birthday,
            
            position: {
                connect: { id: createEmployeeDto.positionId }
            },
            department: {
                connect: { id: createEmployeeDto.departmentId }
            },
        };

        return await this.prisma.employee.create({
            data: insertData
        });
    }
    //#endregion

    //#region Lấy danh sách nhân viên
    async getListEmployees() {
        // Lấy danh sách nhưng không lấy password
        return await this.prisma.employee.findMany({
            omit: { password: true }, // Chỉ định bỏ qua cột password
            orderBy: { id: 'desc' },
        });
    }
    //#endregion

}