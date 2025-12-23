import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateAdminRegisterDto } from './dto/create-register.dto';
import { RegisterService } from './register.service';
import { ApiRegister } from './swagger/register.swagger';
import { LoggerService } from '@logger';

@Controller(ROUTER_ENUM.AUTH.ADMIN.REGISTER)
@ApiTags(ROUTER_TAG_ENUM.AUTH.ADMIN.REGISTER)
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loggerService: LoggerService,
  ) { }
  private context = RegisterController.name;

  @Post()
  @ApiRegister()
  @HttpCode(HTTP_STATUS_ENUM.CREATED)
  async register(@Body() createRegisterDto: CreateAdminRegisterDto) {
    this.loggerService.log(this.context, 'register', createRegisterDto);
    try {
      const staff = await this.registerService.register(createRegisterDto);
      return staff.data;
    } catch (error) {
      this.loggerService.error(this.context, 'register', error);
      throw error;
    }
  }
}

