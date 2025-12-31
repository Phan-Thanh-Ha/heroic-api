import { Injectable, LoggerService } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { SendMailOtpDto } from "src/mail/dto/send-mail-otp.dto";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class EmailRepository {
    context = EmailRepository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) {}

    async sendMailOTP(sendMailOtpDto: SendMailOtpDto, userName?: string) {
        try {
            return await this.mailService.sendMailOTP(sendMailOtpDto, userName);
        } catch (error) {
            throw error;
        }
    }
}