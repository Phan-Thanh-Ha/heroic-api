import { adminAuthSuccessTypes, ApiPost, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { LoggerService } from '@logger';
import { Body, Res } from '@nestjs/common';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { AppController } from 'src/common/decorators/decorator';
import { EmployeeLoginDto } from './dto/employee-login.dto';
import { LoginEntity } from './entities';
import { LoginService } from './login.service';
import { ApiLoginSwagger } from './swagger';
import {  Response } from 'express';


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
  async login(
    @Body() employeeLoginDto: EmployeeLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    this.loggerService.log(this.context, 'login', employeeLoginDto);
    try {
      const employee = await this.loginService.login(employeeLoginDto, res);
      return {
        items: employee.items,
        accessToken: employee.accessToken,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }

}
