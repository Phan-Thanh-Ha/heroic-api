import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { LoggerService } from '@logger';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { ApiLogin } from './swagger';
import { LoginDto } from './dto/login.dto';
import { ApiLoginWithGoogle } from './swagger/login-google.swagger';
import { LoginGoogleDto } from './dto/login-google.dto';

@Controller(ROUTER_ENUM.LOGIN)
@ApiTags(ROUTER_TAG_ENUM.LOGIN)
export class LoginController {
  private context = LoginController.name;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly loginService: LoginService 
  ) {}

  @Post()
  @ApiLogin()
  @HttpCode(HTTP_STATUS_ENUM.OK)
  async login(@Body() loginDto: LoginDto) {
    this.loggerService.debug(this.context, 'login', loginDto);
    try {
      return await this.loginService.login(loginDto);
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }

  //Login with google
  @Post('google')
  @ApiLoginWithGoogle()
  @HttpCode(HTTP_STATUS_ENUM.OK)
  async loginWithGoogle(@Body() loginGoogleDto: LoginGoogleDto) {
    this.loggerService.debug(this.context, 'loginWithGoogle', loginGoogleDto); 
    try {
      return await this.loginService.loginWithGoogle(loginGoogleDto);
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithGoogle', error);
      throw error;
    }
  }
}
