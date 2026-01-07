import { adminAuthErrorTypes, DefaultQueryDto } from "@common"; // File chứa định nghĩa lỗi
import { LoggerService } from "@logger";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { comparePassword, generateHashedDefaultPassword, generateUUID } from "@utils";
import { Prisma } from "@prisma/client";
import { CreateEmployeeDto } from "./dto/create-employee.dto";

@Injectable()
export class EmployeesRepository {
    private context = EmployeesRepository.name;
    constructor(
        private readonly loggerService: LoggerService,
        private readonly prisma: PrismaService,
    ) { }

    //#region Kiểm tra username đã tồn tại chưa
    async getEmployeeByCodeAndPassword(code: string, password: string) {
        try {
            console.log("🚀 🇵 🇭: ~ employees.repository.ts:19 ~ code:", code, password)
            const employee = await this.prisma.employee.findFirst({
                where: { code: code },
            });
            console.log("🚀 🇵 🇭: ~ employees.repository.ts:22 ~ employee:", employee)

            if (!employee) {
                return null;
            }

            const isMatch = await comparePassword(password, employee.password);

            if (!isMatch) {
                return null;
            }

            const { password: _, ...result } = employee;
            return result;
        } catch (error) {
            this.loggerService.error(this.context, error.message, error);
            throw new BadRequestException(adminAuthErrorTypes().AUTH_LOGIN_FAILED);

        }

    }
    //#endregion

    //#region Tạo nhân viên
    async createEmployee(createEmployeeDto: CreateEmployeeDto) {
        const existingEmployee = await this.prisma.employee.findFirst({
            where: {
                OR: [
                    { code: createEmployeeDto.code },
                    { email: createEmployeeDto.email }
                ]
            },
            select: { code: true, email: true }
        });

        if (existingEmployee) {
            if (existingEmployee.code === createEmployeeDto.code) {
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
            code: createEmployeeDto.code,
            dob: createEmployeeDto.birthday,
            // Thêm data vào position và department
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
            const whereCondition: Prisma.employeeWhereInput = {
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
            const employeesListWithNames = employeesList.map((employee) => {
                const { department, position, ...rest } = employee;
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