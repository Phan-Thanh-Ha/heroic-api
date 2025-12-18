import { LoggerService } from '@logger';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminRegisterDto } from './dto/create-register.dto';
import { RegisterRespository } from './register.respository';

@Injectable()
export class RegisterService {
  private context = RegisterService.name;

  constructor(
    private readonly registerRespository: RegisterRespository,
    private readonly loggerService: LoggerService,
  ) {}
  async create(createRegisterDto: CreateAdminRegisterDto) {
    try {
      this.loggerService.log(this.context, 'create-service', createRegisterDto);
      const staff = await this.registerRespository.create(createRegisterDto);
      return {
        data: {
          ...staff,
        },
      };
    } catch (error) {
      this.loggerService.error(this.context, 'create', error);
      // Nếu bên dưới đã ném HttpException (ví dụ: 400 Email đã tồn tại)
      // thì giữ nguyên, không wrap thành 500
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Đăng ký nhân viên thất bại. Vui lòng thử lại sau.');
    }
    
  }
}

