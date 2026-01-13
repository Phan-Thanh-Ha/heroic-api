import { LoggerService } from '@logger';
import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterRespository } from './register.respository';
import { NotificationsGateway } from '@socket';

@Injectable()
export class RegisterService {
  private context = RegisterService.name;

  constructor(
    private readonly registerRespository: RegisterRespository,
    private readonly loggerService: LoggerService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  //#region Đăng ký tài khoản khách hàng
  async register(createRegisterDto: CreateRegisterDto, timeZone?: string) {
    try {
      this.loggerService.log(this.context, 'create-service', createRegisterDto);
      const customer = await this.registerRespository.register(
        createRegisterDto,
        timeZone,
      );

      // Gửi thông báo đến admin khi có khách hàng mới đăng ký
      try {
        this.notificationsGateway.emitNotificationToAllAdmins({
          id: Date.now(),
          title: 'Khách hàng mới đăng ký',
          message: `Khách hàng ${customer.fullName} (${customer.email}) vừa đăng ký tài khoản`,
          type: 'info',
          createdAt: new Date().toISOString(),
          isRead: false,
          customerId: customer.id,
          customerCode: customer.customerCode,
        });
      } catch (notificationError) {
        // Log lỗi nhưng không throw để không ảnh hưởng đến flow đăng ký
        this.loggerService.error(this.context, 'send-notification-to-admin', notificationError);
      }

      return {
        user: {...customer},
        accessToken: '1234567890', // TODO: Generate JWT token thực tế
      };
    } catch (error) {
      this.loggerService.error(this.context, 'register', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Đăng ký thất bại. Vui lòng thử lại sau.');
    }
    
  }
  //#endregion
}

