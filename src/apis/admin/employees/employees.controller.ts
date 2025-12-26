import { adminAuthSuccessTypes, ApiGet, ApiPost, APP_ROUTES, AppController, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { Body, Query } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { ApiCreateEmployeeSwagger, ApiGetListEmployeeSwagger } from './swagger';
import { QueryUserDto } from './dto';
import { adminEmployeeSuccessTypes } from 'src/common/code-type/admin/employee/employee-success.code-type';

@AppController(APP_ROUTES.AUTH.ADMIN.EMPLOYEES)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @ApiPost('create', {
    summary: 'Tạo nhân viên',
    swagger: ApiCreateEmployeeSwagger(),
    response: Employee,
    status: HTTP_STATUS_ENUM.CREATED
  })
  @ResponseMessage(adminAuthSuccessTypes().AUTH_CREATE_EMPLOYEE_SUCCESS.message)
  async createEmployee(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeesService.createEmployee(createEmployeeDto);
  }

  @ApiGet('list', {
    summary: 'Lấy danh sách nhân viên',
    swagger: ApiGetListEmployeeSwagger(),
    response: [Employee],
    status: HTTP_STATUS_ENUM.OK,
  })
  @ResponseMessage(adminEmployeeSuccessTypes().ADMIN_EMPLOYEE_GET_LIST_SUCCESS.message)
  async listEmployees(@Query() query: QueryUserDto) {
    return await this.employeesService.getListEmployees(query);
  }

  // @Get()
  // findAll() {
  //   return this.employeesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.employeesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
  //   return this.employeesService.update(+id, updateEmployeeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.employeesService.remove(+id);
  // }
}
