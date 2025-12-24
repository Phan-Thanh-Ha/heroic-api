import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoggerService } from '@logger';
import { HTTP_STATUS_ENUM } from '@common';
import { ApiLogin } from 'src/apis/customer/auth/login/swagger/login.swagger';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly loginService: LoginService,
  ) {}
  private context = LoginController.name;

  @Post('admin/login')
  @ApiLogin()
  @HttpCode(HTTP_STATUS_ENUM.OK)
  async login(@Body() loginDto: LoginDto) {
    this.loggerService.log(this.context, 'login', loginDto);
    try {
      return await this.loginService.login(loginDto);
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }

}
