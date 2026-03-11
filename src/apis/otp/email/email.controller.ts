import { EmailService } from './email.service';
import { ApiPost } from '../../../common';
import { Body, Controller } from '@nestjs/common';
import { SendMailOtpDto } from '../../../mail/dto/send-mail-otp.dto';
import { ApiSendMailOtp } from './swagger/email.swagger';

@Controller('')
export class EmailController {
  
  constructor(
    private readonly emailService: EmailService,
  ) { }



  @ApiPost('', {
    summary: 'Gửi mail OTP',
    swagger: ApiSendMailOtp(),
  })
  async sendMailOTP(@Body() sendMailOtpDto: SendMailOtpDto) {
    return this.emailService.sendMailOTP(sendMailOtpDto); 
  }

}
