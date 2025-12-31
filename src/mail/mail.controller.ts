import { Body, Controller, Post } from '@nestjs/common';
import { SendMailOtpDto } from './dto/send-mail-otp.dto';
import { MailService } from './mail.service';

@Controller('')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // Nhận mail login 
  @Post('send-otp')
  async sendMailOTP(@Body() sendMailOtpDto: SendMailOtpDto) {
    return this.mailService.sendMailOTP(sendMailOtpDto);
  }
}
