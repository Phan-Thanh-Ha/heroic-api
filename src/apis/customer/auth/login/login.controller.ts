import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { LoggerService } from '@logger';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { ApiLogin } from './swagger';
import { LoginDto } from './dto/login.dto';
import { ApiLoginWithGoogle } from './swagger/login-google.swagger';
import { LoginGoogleDto } from './dto/login-google.dto';
import { Request } from 'express';
import { ApiLoginWithFacebook } from './swagger/login-facebook.swagger';
import { LoginFacebookDto } from './dto/login-facebook.dto';

@Controller(ROUTER_ENUM.AUTH.CUSTOMER.LOGIN)
@ApiTags(ROUTER_TAG_ENUM.AUTH.CUSTOMER.LOGIN)
export class LoginController {
  private context = LoginController.name;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly loginService: LoginService 
  ) {}

  //#region Đăng nhập bằng email
  @Post(ROUTER_ENUM.AUTH.CUSTOMER.LOGIN_WITH_EMAIL)
  @ApiLogin()
  @HttpCode(HTTP_STATUS_ENUM.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    this.loggerService.debug(this.context, 'login', loginDto);
    try {
      return await this.loginService.login(loginDto, req.timeZone);
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }
  //#endregion

  //#region Đăng nhập bằng Google
  @Post(ROUTER_ENUM.AUTH.CUSTOMER.LOGIN_WITH_GOOGLE)
  @ApiLoginWithGoogle()
  @HttpCode(HTTP_STATUS_ENUM.CREATED)
  async loginWithGoogle(
    @Body() loginGoogleDto: LoginGoogleDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    this.loggerService.debug(this.context, 'loginWithGoogle', loginGoogleDto); 
    try {
      return await this.loginService.loginWithGoogle(
        loginGoogleDto,
        req.timeZone,
      );
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithGoogle', error);
      throw error;
    }
  }
  //#endregion

  //#region Đăng nhập bằng Facebook
  @Post(ROUTER_ENUM.AUTH.CUSTOMER.LOGIN_WITH_FACEBOOK)
  @ApiLoginWithFacebook()
  @HttpCode(HTTP_STATUS_ENUM.CREATED)
  async loginWithFacebook(
    @Body() loginFacebookDto: LoginFacebookDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    this.loggerService.debug(this.context, 'loginWithFacebook', loginFacebookDto);
    try {
      return await this.loginService.loginWithFacebook(
        loginFacebookDto,
        req.timeZone,
      );
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithFacebook', error);
      throw error;
    }
  }
}
