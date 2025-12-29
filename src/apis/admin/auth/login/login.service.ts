import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { EmployeeLoginDto } from './dto/employee-login.dto';
import { LoginRepository } from './login.repository';
import { Response } from 'express';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly loggerService: LoggerService,
  ) {}
  async login(employeeLoginDto: EmployeeLoginDto, res: Response) {
    this.loggerService.log(this.context, 'login', employeeLoginDto);
    try {
      const employee = await this.loginRepository.login(employeeLoginDto,res);
      return {
        items: employee.items,
        accessToken: employee.accessToken,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }
}
