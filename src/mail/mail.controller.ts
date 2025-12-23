import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ROUTER_ENUM } from 'src/common/enums/router.enum';
import { ROUTER_TAG_ENUM } from 'src/common/enums/swagger-tag.enum';
import { SendMailOtpDto } from './dto/send-mail-otp.dto';
import { MailService } from './mail.service';

@Controller(ROUTER_ENUM.EMAIL)
@ApiTags(ROUTER_TAG_ENUM.MAIL.SEND_OTP)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // Nhận mail login 
  @Post('send-otp')
  async sendMailOTP(@Body() sendMailOtpDto: SendMailOtpDto) {
    return this.mailService.sendMailOTP(sendMailOtpDto);
  }
}
