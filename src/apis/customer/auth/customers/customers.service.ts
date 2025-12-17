import { LoggerService } from '@logger';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomersRespository } from './customers.respository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { formatDateToYMD, toUnixByTimeZone } from '@utils';

@Injectable()
export class CustomersService {
  private readonly context = 'CustomersService';

  constructor(
    private readonly customersRepository: CustomersRespository,
    private readonly loggerService: LoggerService,
  ) {}



  async create(createCustomerDto: CreateCustomerDto, timeZone?: string) {
    try {
      const customer = await this.customersRepository.create(createCustomerDto);

      return {
        ...customer,
        // createdAt trả về dạng Unix theo đúng múi giờ client gửi lên
        createdAt: toUnixByTimeZone(customer.createdAt, timeZone),
        // dateOfBirth trả về dạng yyyy-MM-dd (không kèm T...Z)
        dateOfBirth: formatDateToYMD(customer.dateOfBirth),
      };
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
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
