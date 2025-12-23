import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoggerService } from '@logger';
import { LoginRepository } from './login.repository';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { formatDateToYMD, toUnixByTimeZone } from '@utils';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly loggerService: LoggerService,
  ) { }

  //#region Đăng nhập bằng email
  async login(loginDto: LoginDto, timeZone?: string) {
    try {
      this.loggerService.debug(this.context, 'login', loginDto);
      const result = await this.loginRepository.loginWithEmail(loginDto);
      return {
        message: result.message,
        info: {
          ...result.info,
          dateOfBirth: formatDateToYMD(result.info?.dateOfBirth),
          createdAt: toUnixByTimeZone(result.info?.createdAt, timeZone),
        },
        accessToken: result.accessToken,
        otpCode: result.otpCode,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'login', error);
      throw error;
    }
  }
  //#endregion

  //#region Đăng nhập bằng Google
  async loginWithGoogle(loginGoogleDto: LoginGoogleDto, timeZone?: string) {
    try {
      this.loggerService.log(this.context, 'loginWithGoogle', loginGoogleDto);
      const result = await this.loginRepository.loginWithGoogle(
        loginGoogleDto,
      );
      return {
        message: result.message,
        info: {
          ...result.info,
          dateOfBirth: formatDateToYMD(result.info?.dateOfBirth),
          createdAt: toUnixByTimeZone(result.info?.createdAt, timeZone),
        },
        accessToken: result.accessToken,
        otpCode: result.otpCode,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithGoogle', error);
      throw error;
    }
  }
  //#endregion

  //#region Đăng nhập bằng Facebook
  async loginWithFacebook(loginFacebookDto: LoginFacebookDto, timeZone?: string) {
    try {
      this.loggerService.debug(this.context, 'loginWithFacebook', loginFacebookDto);

      const result = await this.loginRepository.loginWithFacebook(loginFacebookDto);
      return {
        message: result.message,
        info: {
          ...result.info,
          dateOfBirth: formatDateToYMD(result.info?.dateOfBirth),
          createdAt: toUnixByTimeZone(result.info?.createdAt, timeZone),
        },
        accessToken: result.accessToken,
        otpCode: result.otpCode,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithFacebook', error);
      throw error;
    }
  }
  //#endregion

  //#region Xác thực OTP
  async verifyOtp(verifyOtpDto: VerifyOtpDto, timeZone?: string) {
    try {
      this.loggerService.debug(this.context, 'verifyOtp', verifyOtpDto);
      const result = await this.loginRepository.verifyOtp(verifyOtpDto);
      return {
        message: result.message,
        info: {
          ...result.info,
          dateOfBirth: formatDateToYMD(result.info?.dateOfBirth),
          createdAt: toUnixByTimeZone(result.info?.createdAt, timeZone),
        },
      };
    } catch (error) {
      this.loggerService.error(this.context, 'verifyOtp', error);
      throw error;
    }
  }
  //#endregion
}
