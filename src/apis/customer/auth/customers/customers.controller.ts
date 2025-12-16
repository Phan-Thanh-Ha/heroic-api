import { Body, Controller, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { LoggerService } from '@logger';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly loggerService: LoggerService,
  ) { }
  private context = CustomersController.name;

  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto
  ) {
    try {
      return this.customersService.create(createCustomerDto);
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
      throw error;
    }

  }

  // @Get()
  // findAll() {
  //   return this.customersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.customersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
  //   return this.customersService.update(+id, updateCustomerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.customersService.remove(+id);
  // }
}
