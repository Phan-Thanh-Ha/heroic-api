import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { CreateAdminRegisterDto } from "./dto/create-register.dto";


@Injectable()
export class RegisterRespository {
	private context = RegisterRespository.name;
	constructor(
		private readonly prisma: PrismaService,
		private readonly loggerService: LoggerService,
	) { }

	async register(createRegisterDto: CreateAdminRegisterDto) {
		try {

			this.loggerService.log(this.context, 'register', 'Staff registration - TODO: Implement when Staff model is created');
			
			// Placeholder response
			return {
				message: 'Đăng ký nhân viên - Chức năng đang được phát triển',
				data: createRegisterDto,
			};
		} catch (error) {
			this.loggerService.error(this.context, 'create', error);
			throw error;
		}
	}
}

