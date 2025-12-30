import { APP_ROUTES, AppController,ApiPost, ResponseMessage, customerAuthSuccessTypes, HTTP_STATUS_ENUM } from '@common';
import { LoggerService } from '@logger';
import { Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterService } from './register.service';
import { ApiRegister } from './swagger/register.swagger';
import { RegisterEntity } from './entities/register.entity';

@AppController(APP_ROUTES.CUSTOMER.AUTH.REGISTER)
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loggerService: LoggerService,
  ) { }
  private context = RegisterController.name;

  @ApiPost('email', {
    summary: 'Đăng ký tài khoản khách hàng',
    swagger: ApiRegister(),
    response: RegisterEntity
  })
  @ResponseMessage(customerAuthSuccessTypes().AUTH_REGISTER_SUCCESS.message)
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    return await this.registerService.register(createRegisterDto, req.timeZone);
  }

}

