import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loggerService: LoggerService,
  ) {}
  async login(loginDto: LoginDto) {
    this.loggerService.log(this.context, 'login', loginDto);
    return {
      message: 'Login successful',
    };
  }
}
