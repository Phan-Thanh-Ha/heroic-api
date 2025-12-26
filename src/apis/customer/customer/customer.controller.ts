import { Controller, Get} from '@nestjs/common';
import { CustomerService } from './customer.service';

import { ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { ApiTags } from '@nestjs/swagger';

@Controller(ROUTER_ENUM.CUSTOMERS.LISTCUSTOMER)
@ApiTags(ROUTER_TAG_ENUM.CUSTOMERS.LISTCUSTOMER)
export class CustomerController {
  private context = CustomerController.name;
  constructor(private readonly customerService: CustomerService) {}

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customerService.create(createCustomerDto);
  // }

  @Get()
  getListCustomer() {
    return this.customerService.getListCustomer() 
    
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
