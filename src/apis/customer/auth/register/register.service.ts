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

  //#region Đăng ký tài khoản khách hàng
  async register(createRegisterDto: CreateRegisterDto, timeZone?: string) {
    try {
      this.loggerService.log(this.context, 'create-service', createRegisterDto);
      const customer = await this.registerRespository.register(
        createRegisterDto,
        timeZone,
      );
      return {
        user: {...customer},
        accessToken: '1234567890', // TODO: Generate JWT token thực tế
      };
    } catch (error) {
      this.loggerService.error(this.context, 'register', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
    
  }
  //#endregion
}

