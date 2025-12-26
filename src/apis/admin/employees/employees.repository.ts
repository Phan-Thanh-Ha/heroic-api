import { BadRequestException, Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "@prisma";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { generateUUID, generateHashedDefaultPassword } from "@utils";
import { adminAuthErrorTypes, DefaultQueryDto, paginationToQuery } from "@common"; // File chứa định nghĩa lỗi
import { Prisma } from "generated/prisma";

@Injectable()
export class EmployeesRepository {
    private context = EmployeesRepository.name;
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
    async getListEmployees(query: DefaultQueryDto) {
        try {
            const { search } = query
    
            // Điều kiện lọc
            const whereCondition: Prisma.EmployeeWhereInput = {
                ...(search ? {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { code: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { phoneNumber: { contains: search, mode: 'insensitive' } },
                        { identity_number: { contains: search, mode: 'insensitive' } },
                    ],
                } : {}),
            };
    
            // Query lấy danh sách nhân viên
            const findManyQuery = this.prisma.employee.findMany({
                where: whereCondition,
                omit: { password: true },
                include: {
                    department: true,
                    position: true,
                },
                orderBy: { id: 'desc' },
            });
    
            // Query đếm tổng số lượng nhân viên
            const countQuery = this.prisma.employee.count({
                where: whereCondition,
            });
    
            // Thực thi song song
            const [employeesList, totalCount] = await this.prisma.$transaction([
                findManyQuery,
                countQuery
            ]);
    
            // Làm phẳng dữ liệu
            const employeesListWithNames = employeesList.map((emp) => {
                const { department, position, ...rest } = emp;
                return {
                    ...rest,
                    departmentId: department?.id || null,
                    departmentName: department?.name || null,
                    positionId: position?.id || null,
                    positionName: position?.name || null,
                };
            });
            
            // Trả về kết quả
            return {
                items: employeesListWithNames,
                total: totalCount,
            };
    
        } catch (error) {
            this.loggerService.error(this.context, error.message, error);
            throw new BadRequestException(adminAuthErrorTypes().AUTH_GET_LIST_EMPLOYEES_FAILED);
        }
    }
    //#endregion

}