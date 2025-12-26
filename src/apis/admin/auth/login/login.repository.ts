import { Injectable } from "@nestjs/common";
import { LoginDto } from "./dto";
import { PrismaService } from "@prisma";
import { LoggerService } from "@logger";

@Injectable()
export class LoginRepository {
    private context = LoginRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly loggerService: LoggerService) { }

    async login(loginDto: LoginDto) {
        try {
            const user = await this.prisma.employee.findUnique({
                where: {
                    code: loginDto.username,
                },
            });
            return user;
        } catch (error) {
            this.loggerService.error(this.context, 'login', error);
            throw error;
        }
    }
}