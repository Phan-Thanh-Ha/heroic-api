import { adminAuthSuccessTypes, ApiPost, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { LoggerService } from '@logger';
import { Body, HttpCode, Post } from '@nestjs/common';
import { ApiLogin } from 'src/apis/customer/auth/login/swagger/login.swagger';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { AppController } from 'src/common/decorators/decorator';
import { LoginDto } from './dto/employee-login.dto';
import { LoginService } from './login.service';
import { ApiLoginSwagger } from './swagger';
import { LoginEntity } from './entities';

@AppController(APP_ROUTES.AUTH.ADMIN.LOGIN)
export class LoginController {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly loginService: LoginService,
  ) {}
  private context = LoginController.name;

  @ApiPost('login', {
    summary: 'Đăng nhập',
    swagger: ApiLoginSwagger(),
    response: LoginEntity,
    status: HTTP_STATUS_ENUM.OK,
  })
  @ResponseMessage(adminAuthSuccessTypes().AUTH_LOGIN_SUCCESS.success_code)
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
