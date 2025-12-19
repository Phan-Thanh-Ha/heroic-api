import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoggerService } from '@logger';
import { LoginRepository } from './login.repository';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { formatDateToYMD, toUnixByTimeZone } from '@utils';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly loggerService: LoggerService,
  ) { }

  //#region Đăng nhập bằng email
  async login(loginDto: LoginDto, _timeZone?: string) {
    try {
      this.loggerService.debug(this.context, 'login', loginDto);
      // TODO: Implement login logic with email và password + timezone nếu cần
      return {
        message: 'Đăng nhập thành công bằng email',
        data: loginDto,
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
      };
    } catch (error) {
      this.loggerService.error(this.context, 'loginWithFacebook', error);
      throw error;
    }
  }
  //#endregion
}
