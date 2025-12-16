import { LoggerService } from '@logger';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomersRespository } from './customers.respository';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  private readonly context = 'CustomersService';

  constructor(
    private readonly customersRepository: CustomersRespository,
    private readonly loggerService: LoggerService,
  ) {}



  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const result = await this.customersRepository.create(createCustomerDto);
      return result;
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
      // Nếu repository đã ném HttpException (ví dụ: BadRequestException - Email đã tồn tại)
      // thì giữ nguyên, không wrap thành 500
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Thêm khách hàng thất bại');
    }
  }

  // findAll() {
  //   return `This action returns all customers`;
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
