import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { LoggerService } from '@logger';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class EmployeesService {
  // Định nghĩa context để log (nếu cần dùng cho các logic nghiệp vụ phức tạp khác)
  private context = EmployeesService.name;

  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly loggerService: LoggerService,
  ) {}
  
  //#region Tạo nhân viên
  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.employeesRepository.createEmployee(createEmployeeDto);
    return {
      data: employee,
    };
  }
  //#endregion

  //#region Lấy danh sách nhân viên
  async getListEmployees() {
    const employees = await this.employeesRepository.getListEmployees();
    return {
      data: employees,
    };
  }
  //#endregion
  
}