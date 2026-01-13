import { adminAuthSuccessTypes, ApiGet, ApiPost, APP_ROUTES, AppController, ResponseMessage } from '@common';
import { Body, Query } from '@nestjs/common';
import { adminEmployeeSuccessTypes } from 'src/common/code-type/admin/employee/employee-success.code-type';
import { QueryUserDto } from './dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { ApiCreateEmployeeSwagger } from './swagger/create-employee.swagger';
import { ApiGetListEmployeeSwagger } from './swagger/get-list-employee.swagger';
@AppController(APP_ROUTES.ADMIN.EMPLOYEES)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  //#region Tạo nhân viên
  @ApiPost('create', {
    summary: 'Tạo nhân viên',
    swagger: ApiCreateEmployeeSwagger(),
  })
  @ResponseMessage(adminAuthSuccessTypes().AUTH_CREATE_EMPLOYEE_SUCCESS.message)
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeesService.createEmployee(createEmployeeDto);
  }
  //#endregion

  //#region Lấy danh sách nhân viên
  @ApiGet('list', {
    summary: 'Lấy danh sách nhân viên',
    swagger: ApiGetListEmployeeSwagger(),
  })
  @ResponseMessage(adminEmployeeSuccessTypes().ADMIN_EMPLOYEE_GET_LIST_SUCCESS.message)
  async listEmployees(@Query() query: QueryUserDto) {
    return await this.employeesService.getListEmployees(query);
  }
  //#endregion


}
