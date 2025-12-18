import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterService } from './register.service';
import { ApiRegister } from './swagger/register.swagger';
import { LoggerService } from '@logger';
import { Request } from 'express';

@Controller(ROUTER_ENUM.AUTH.CUSTOMER.REGISTER)
@ApiTags(ROUTER_TAG_ENUM.AUTH.CUSTOMER.REGISTER)
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loggerService: LoggerService,
  ) { }
  private context = RegisterController.name;

  @Post()
  @ApiRegister()
  @HttpCode(HTTP_STATUS_ENUM.CREATED)
  async register(
    @Body() createRegisterDto: CreateRegisterDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    this.loggerService.log(this.context, 'register', createRegisterDto);
    try {
      const result = await this.registerService.register(
        createRegisterDto,
        req.timeZone,
      );
      return result;
    } catch (error) {
      this.loggerService.error(this.context, 'register', error);
      throw error;
    }
  }

}

