import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { ApiTags } from '@nestjs/swagger';

@Controller(ROUTER_ENUM.CUSTOMERS.LISTCUSTOMER)
@ApiTags(ROUTER_TAG_ENUM.CUSTOMERS.LISTCUSTOMER)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customerService.create(createCustomerDto);
  // }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customerService.update(+id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customerService.remove(+id);
  // }
}
