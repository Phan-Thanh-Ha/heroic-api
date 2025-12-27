import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { UpdateCustomerDto } from './dto/update-customer.dto';


@Injectable()
export class CustomerService {
  constructor(
          private readonly customerRepository: CustomerRepository,
      ) {}

  async getCustomerList() {
    return this.customerRepository.getCustomerList();
  }
 
  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }
    

  // findOne(id: number) {
  //   return `This action returns a #${id} customer`;
  // }

  // update(id: number, updateCustomerDto: UpdateCustomerDto) {
  //   return `This action updates a #${id} customer`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} customer`;
  // }
}
