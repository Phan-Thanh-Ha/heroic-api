import { BadRequestException, Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "@prisma";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { generateUUID, generateHashedDefaultPassword } from "@utils";
import { adminAuthErrorTypes, DefaultQueryDto, paginationToQuery } from "@common"; // File chứa định nghĩa lỗi

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
            // 1. Lấy tham số skip và take từ helper
            const { skip, take } = paginationToQuery(query);

            // 2. Chạy song song: Query dữ liệu (có skip/take) và Đếm tổng số bản ghi
            const [employeesList, totalCount] = await Promise.all([
                this.prisma.employee.findMany({
                    omit: { password: true },
                    where: {}, // Nếu sau này có tìm kiếm (search), điền vào đây
                    orderBy: { id: 'desc' },
                    skip: skip,     
                    take: take as number, 
                }),
                this.prisma.employee.count({
                    where: {}, // Nhớ khớp điều kiện where với findMany ở trên nếu có search
                }),
            ]);

            // 3. Trả về format [Data, Total] để Interceptor/Controller xử lý tiếp
            return [employeesList, totalCount];

        } catch (error) {
            this.loggerService.error(this.context, error.message, error);
            throw new BadRequestException(adminAuthErrorTypes().AUTH_GET_LIST_EMPLOYEES_FAILED);
        }
    }
    //#endregion

}