import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginGoogleDto } from './dto/login-google.dto';
import { LoggerService } from '@logger';
import { LoginRepository } from './login.repository';
import { LoginFacebookDto } from './dto/login-facebook.dto';
import { formatDateToYMD, toUnixByTimeZone } from '@common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { NotificationsService, NotificationsGateway, createAndEmitNotificationToAdmins } from '@socket';

@Injectable()
export class LoginService {
  private context = LoginService.name;
  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly loggerService: LoggerService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) { }

  //#region Đăng nhập bằng email
  async loginWithEmail(loginDto: LoginDto, timeZone?: string) {
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
        otpCode: result.otpCode, // Chỉ trả về OTP, token sẽ được cấp sau khi verify OTP
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

      // Gửi thông báo đến admin nếu đây là customer mới (đăng ký qua Google)
      // Kiểm tra createdAt - nếu trong vòng 10 giây thì là customer mới
      if (result.info?.createdAt) {
        const createdAt = new Date(result.info.createdAt);
        const now = new Date();
        const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;
        
        // Nếu customer được tạo trong vòng 10 giây thì gửi notification
        if (diffSeconds <= 10) {
          try {
            // Luồng: Lưu vào database trước → Sau đó emit qua socket
            await createAndEmitNotificationToAdmins(
              this.notificationsService,
              this.notificationsGateway,
              {
                title: 'Khách hàng mới đăng ký',
                message: `Khách hàng ${result.info.fullName} (${result.info.email}) vừa đăng ký qua Google`,
                type: 'info',
                customerId: result.info.id,
                customerCode: result.info.customerCode,
              }
            );
          } catch (notificationError) {
            this.loggerService.error(this.context, 'send-notification-to-admin', notificationError);
          }
        }
      }

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

      // Gửi thông báo đến admin nếu đây là customer mới (đăng ký qua Facebook)
      // Kiểm tra createdAt - nếu trong vòng 10 giây thì là customer mới
      if (result.info?.createdAt) {
        const createdAt = new Date(result.info.createdAt);
        const now = new Date();
        const diffSeconds = (now.getTime() - createdAt.getTime()) / 1000;
        
        // Nếu customer được tạo trong vòng 10 giây thì gửi notification
        if (diffSeconds <= 10) {
          try {
            // Luồng: Lưu vào database trước → Sau đó emit qua socket
            await createAndEmitNotificationToAdmins(
              this.notificationsService,
              this.notificationsGateway,
              {
                title: 'Khách hàng mới đăng ký',
                message: `Khách hàng ${result.info.fullName} (${result.info.email}) vừa đăng ký qua Facebook`,
                type: 'info',
                customerId: result.info.id,
                customerCode: result.info.customerCode,
              }
            );
          } catch (notificationError) {
            this.loggerService.error(this.context, 'send-notification-to-admin', notificationError);
          }
        }
      }

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
        accessToken: result.accessToken,
      };
    } catch (error) {
      this.loggerService.error(this.context, 'verifyOtp', error);
      throw error;
    }
  }
  //#endregion
}
