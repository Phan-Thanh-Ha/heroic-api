import { ApiPost, APP_ROUTES, AppController, customerAuthSuccessTypes, Public, ResponseMessage } from '@common';
import { LoggerService } from '@logger';
import { Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterEntity } from './entities/register.entity';
import { RegisterService } from './register.service';
import { ApiRegister } from './swagger/register.swagger';
import { ApiSecurity } from '@nestjs/swagger';

@AppController(APP_ROUTES.CUSTOMER.AUTH.REGISTER)
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loggerService: LoggerService,
  ) { }

  @ApiPost('email', {
    summary: 'Đăng ký tài khoản khách hàng',
    swagger: ApiRegister(),
  })
  @ApiSecurity('JWT') // Để có thể swagger gọi được api này
  @Public() // Để có thể gọi được api này không cần token
  @ResponseMessage(customerAuthSuccessTypes().AUTH_REGISTER_SUCCESS.message)
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    return await this.registerService.register(createRegisterDto, req.timeZone);
  }

}

