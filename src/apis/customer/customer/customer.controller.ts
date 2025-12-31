import { ApiSecurity } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';

import { ApiGet, APP_ROUTES, AppController, ResponseMessage } from '@common';
import { customerSuccessTypes } from 'src/common/code-type/customers/customer-success.code-type';
import { ApiCustomerGetList } from './swagger/get-customer-list.swagger';
import { JwtAuthGuard } from '@guards';

@AppController(APP_ROUTES.CUSTOMER.LIST)
export class CustomerController {
  private context = CustomerController.name;
  constructor(private readonly customerService: CustomerService) { }

  // @Post()
  // create(@Body() createCustomerDto: CreateCustomerDto) {
  //   return this.customerService.create(createCustomerDto);
  // }
  //get
  @ApiGet('', {
    summary: 'Lấy danh sách khách hàng',
    swagger: ApiCustomerGetList()
  })
  @ApiSecurity('JWT')
  @ResponseMessage(customerSuccessTypes().GET_CUSTOMER_LIST.message)
  async getCustomerList() {
    return await this.customerService.getCustomerList();
  }
  // @ApiPatch(':id', {
  //   summary: 'Cập nhật thông tin danh sách khách hàng'
  // })

  // @ResponseMessage(customerSuccessTypes().UPDATE_CUSTOMER.message) // 4. Thêm message success
  // async update(
  //   @Param('id') id: string, 
  //   @Body() updateCustomerDto: UpdateCustomerDto
  // )
  // {
  //   // return this.customerService.update(+id, updateCustomerDto);
  // }






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
