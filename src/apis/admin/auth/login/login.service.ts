import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { LoginDto } from './dto/login.dto';
import { LoginRepository } from './login.repository';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly loggerService: LoggerService,
  ) {}
  async login(loginDto: LoginDto) {
    this.loggerService.log(this.context, 'login', loginDto);
    try {
      const user = await this.loginRepository.login(loginDto);
      return {
        message: 'Login successful',
      };
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }
}
