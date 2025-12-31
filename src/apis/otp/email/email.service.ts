import { Injectable } from '@nestjs/common';
import { SendMailOtpDto } from 'src/mail/dto/send-mail-otp.dto';
import { EmailRepository } from './email.repository';

@Injectable()
export class EmailService {

  constructor(
    private readonly emailRepository: EmailRepository
  ) {}
  
  async sendMailOTP(sendMailOtpDto: SendMailOtpDto, userName?: string) {
    return this.emailRepository.sendMailOTP(sendMailOtpDto, userName);
  }
}
