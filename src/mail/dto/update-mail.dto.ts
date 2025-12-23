import { PartialType } from '@nestjs/swagger';
import { SendMailOtpDto } from './send-mail-otp.dto';

export class UpdateMailDto extends PartialType(SendMailOtpDto) {}
