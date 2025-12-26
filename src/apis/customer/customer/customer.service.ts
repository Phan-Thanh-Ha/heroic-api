import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';


@Injectable()
export class CustomerService {
  constructor(
          private readonly customerRepository: CustomerRepository,
      ) {}

  async getCustomerList() {
    return this.customerRepository.getCustomerList();
  }

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
