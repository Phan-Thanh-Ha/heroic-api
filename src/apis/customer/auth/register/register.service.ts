import { LoggerService } from '@logger';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterRespository } from './register.respository';

@Injectable()
export class RegisterService {
  private context = RegisterService.name;

  constructor(
    private readonly registerRespository: RegisterRespository,
    private readonly loggerService: LoggerService,
  ) {}
  async create(createRegisterDto: CreateRegisterDto) {
    try {
      this.loggerService.log(this.context, 'create-service', createRegisterDto);
      const customer = await this.registerRespository.create(createRegisterDto);
      return {
        data: {
          ...customer,
        },
      };
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
      // Nếu bên dưới đã ném HttpException (ví dụ: 400 Email đã tồn tại)
      // thì giữ nguyên, không wrap thành 500
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
    
  }

  // findAll() {
  //   return `This action returns all register`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} register`;
  // }

  // update(id: number, updateRegisterDto: UpdateRegisterDto) {
  //   return `This action updates a #${id} register`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} register`;
  // }
}
