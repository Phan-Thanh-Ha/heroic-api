import { LoggerService } from "@logger";
import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { CustomersService } from "../customers/customers.service";
import { CreateRegisterDto } from "./dto/create-register.dto";


@Injectable()
export class RegisterRespository {
	private context = RegisterRespository.name;
	constructor(
		private readonly prisma: PrismaService,
		private readonly loggerService: LoggerService,
		private customersService: CustomersService
	) { }

	async create(createRegisterDto: CreateRegisterDto) {
		try {
			const result = await this.customersService.create({
				...createRegisterDto,
				typeRegister: createRegisterDto.typeRegister,
			});
			return result;

		} catch (error) {
			this.loggerService.error(this.context, 'create', error);
			throw error;
		}
	}
}
