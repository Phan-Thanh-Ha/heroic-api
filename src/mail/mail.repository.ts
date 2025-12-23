import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { SendMailOtpDto } from "./dto/send-mail-otp.dto";


@Injectable()
export class MailRepository {
    constructor(private readonly prisma: PrismaService) { }

    // async sendMailOTP(sendMailOtpDto: SendMailOtpDto) {
    //     return 'test'
    // }
}
