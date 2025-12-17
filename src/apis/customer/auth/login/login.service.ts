import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoggerService } from '@logger';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loggerService: LoggerService,
  ) { }
  async login(loginDto: LoginDto) {
    try {
      this.loggerService.debug(this.context, 'login', loginDto);
      return {
        message: 'Đăng nhập thành công bằng email',
        data: loginDto,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }

  async loginWithGoogle(loginGoogleDto: LoginGoogleDto) {
    try {
      this.loggerService.debug(this.context, 'loginWithGoogle', loginGoogleDto);
      return {
        message: 'Đăng nhập thành công với Google',
        data: loginGoogleDto,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithGoogle', error);
      throw error;
    }
  }
}
