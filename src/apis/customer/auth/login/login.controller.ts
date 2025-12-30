import { ApiPost, APP_ROUTES, AppController } from '@common';
import { LoggerService } from '@logger';
import { Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginService } from './login.service';
import { ApiLogin } from './swagger';
import { ApiLoginWithFacebook } from './swagger/login-facebook.swagger';
import { ApiLoginWithGoogle } from './swagger/login-google.swagger';
import { ApiVerifyOtp } from './swagger/verify-otp.swagger';

@AppController(APP_ROUTES.CUSTOMER.AUTH.LOGIN)
export class LoginController {
  private context = LoginController.name;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly loginService: LoginService
  ) { }

  //#region Đăng nhập bằng email
  @ApiPost('email', {
    summary: 'Đăng nhập bằng email',
    swagger: ApiLogin()
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    return await this.loginService.login(loginDto, req.timeZone);
  }
  //#endregion

  //#region Đăng nhập bằng Google
  @ApiPost('google', {
    summary: 'Đăng nhập bằng Google',
    swagger: ApiLoginWithGoogle() // Truyền decorator swagger vào
  })
  async loginWithGoogle(@Body() dto: LoginGoogleDto) {
    // KHÔNG try-catch, KHÔNG logger thủ công
    return await this.loginService.loginWithGoogle(dto);
  }
  //#endregion

  //#region Đăng nhập bằng Facebook
  @ApiPost('facebook', {
    summary: 'Đăng nhập bằng Facebook',
    swagger: ApiLoginWithFacebook()
  })
  async loginWithFacebook(
    @Body() dto: LoginFacebookDto,
    @Req() req: any, // Dùng type Request custom của bạn
  ) {
    return await this.loginService.loginWithFacebook(dto, req.timeZone);
  }
  //#endregion

  //#region Xác thực OTP
  @ApiPost('verify-otp', {
    summary: 'Xác thực OTP',
    swagger: ApiVerifyOtp()
  })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Req() req: Request & { timeZone?: string },
  ) {
    this.loggerService.debug(this.context, 'verifyOtp', verifyOtpDto);
    try {
      return await this.loginService.verifyOtp(verifyOtpDto, req.timeZone);
    } catch (error) {
      this.loggerService.error(this.context, 'verifyOtp', error);
      throw error;
    }
  }
  //#endregion
}
