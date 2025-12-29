import { adminAuthErrorTypes } from "@common";
import { JwtService } from "@jwt";
import { LoggerService } from "@logger";
import { BadRequestException, Injectable } from "@nestjs/common";
import { setCookieRFToken } from "src/common/helpers/setCookieRFToken";
import { EmployeesRepository } from "../../employees/employees.repository";
import { EmployeeLoginDto } from "./dto/employee-login.dto";
import { Response } from 'express';

@Injectable()
export class LoginRepository {
    private context = LoginRepository.name;
    constructor(
        private readonly loggerService: LoggerService,
        private readonly employeesRepository: EmployeesRepository,
        private readonly jwtService: JwtService,
    ) { }

    //#region Đăng nhập
    async login(employeeLoginDto: EmployeeLoginDto, res: Response) {
        try {
            const employee = await this.employeesRepository.getEmployeeByCodeAndPassword(employeeLoginDto.username, employeeLoginDto.password);
            if (!employee) {
                throw new BadRequestException(adminAuthErrorTypes().AUTH_LOGIN_FAILED);
            }

            // Tạo token
            const accessToken = await this.jwtService.signJwtAdmin({
                id: employee.id,
                uuid: employee.uuid,
                code: employee.code,
                positionId: employee.positionId,
                departmentId: employee.departmentId,
                fullName: employee.fullName,
                email: employee.email,
            });

            // tạo refresh token
            const refreshToken = await this.jwtService.signJwtAdmin({
                id: employee.id,
                uuid: employee.uuid,
                code: employee.code,
                positionId: employee.positionId,
                departmentId: employee.departmentId,
                fullName: employee.fullName,
                email: employee.email,
            });

            setCookieRFToken(res, refreshToken);

            return {
                items: employee,
                accessToken: accessToken,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'login', error);
            throw new BadRequestException(adminAuthErrorTypes().AUTH_LOGIN_FAILED);
        }
    }
    //#endregion
}