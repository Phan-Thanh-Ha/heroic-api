import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { LoggerService } from '@logger';

@Injectable()
export class EmployeesService {
  private context = EmployeesService.name;
  constructor(
    private readonly loggerService: LoggerService,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    this.loggerService.log(this.context, 'create', createEmployeeDto);
    return 'This action adds a new employee';
  }

  // findAll() {
  //   return `This action returns all employees`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} employee`;
  // }

  // update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  //   return `This action updates a #${id} employee`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} employee`;
  // }
}
