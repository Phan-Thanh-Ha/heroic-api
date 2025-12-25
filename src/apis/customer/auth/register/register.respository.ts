import { LoggerService } from "@logger";
import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { convertDdMmYyyyToUTCDate, formatDateToYMD, generateCustomerCode, generateUUID, toUnixByTimeZone } from "@utils";
import bcrypt from "bcryptjs";
import { CreateRegisterDto } from "./dto/create-register.dto";


@Injectable()
export class RegisterRespository {
	private context = RegisterRespository.name;
	constructor(
		private readonly prisma: PrismaService,
		private readonly loggerService: LoggerService,
	) { }

	//#region Kiểm tra email đã tồn tại chưa
	private async checkEmailExists(email: string) {
		const existingCustomer = await this.prisma.customer.findUnique({
			where: { email: email },
		});
		return existingCustomer;
	}
	//#endregion

	//#region Tạo tài khoản khách hàng
	private async createCustomer(
		createRegisterDto: CreateRegisterDto,
		timeZone?: string,
	) {
        try {
            const dateOfBirthToSave = convertDdMmYyyyToUTCDate(createRegisterDto.birthday);
            const passwordHashed = await bcrypt.hash(createRegisterDto.password, 10);
            // Cần id trước rồi mới sinh được mã KHyyMMdd0001 (dựa trên id)
                const customer = await this.prisma.$transaction(async (tx) => {
                // 1. Insert trước để lấy id
                // Chỉ insert các trường hợp lệ, loại bỏ facebookId, googleId, fullAddress
                // Normalize typeRegister thành 'Email' (chữ E hoa) để nhất quán
                const customerData: any = {
                    uuid: generateUUID(),
                    customerCode: '',
                    firstName: createRegisterDto.firstName,
                    lastName: createRegisterDto.lastName,
                    fullName: createRegisterDto.fullName,
                    avatarUrl: createRegisterDto.avatarUrl,
                    email: createRegisterDto.email,
                    address: createRegisterDto.address,
                    phoneNumber: createRegisterDto.phoneNumber,
                    dateOfBirth: dateOfBirthToSave,
                    password: passwordHashed,
                    typeRegister: 'Email', // Luôn là 'Email' cho endpoint này
                    provinceId: createRegisterDto.provinceId,
                    districtId: createRegisterDto.districtId,
                    wardId: createRegisterDto.wardId,
                };

                // Endpoint này chỉ dành cho đăng ký Email, không có facebookId/googleId

                const createdCustomer = await tx.customer.create({
                    data: customerData,
                });

                // Sinh mã từ id vừa insert
                const customerCode = generateCustomerCode(createdCustomer.id);

                // 3. Update lại customerCode dựa trên id
                const updatedCustomer = await tx.customer.update({
                    where: { id: createdCustomer.id },
                    data: { customerCode },
                });

                return updatedCustomer;
            });

            const { password, ...customerResponse } = customer;

			// Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
			const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

			return {
				...customerResponse,
				customerCode: trimmedCustomerCode,
				dateOfBirth: formatDateToYMD(customerResponse.dateOfBirth),
				createdAt: toUnixByTimeZone(customerResponse.createdAt, timeZone),
			};
        } catch (error) {
            this.loggerService.error(this.context, 'createCustomer', error);
            throw error;
        }
    }
    //#endregion


	//#region Đăng ký tài khoản khách hàng
	async register(createRegisterDto: CreateRegisterDto, timeZone?: string) {
		// Kiểm tra email đã tồn tại chưa
		const existingCustomer = await this.checkEmailExists(createRegisterDto.email);
		if (existingCustomer) {
			throw new ConflictException('Email đã tồn tại');
		}
		
		try {
			const customer = await this.createCustomer(createRegisterDto, timeZone);
			return customer;
		} catch (error) {
			this.loggerService.error(this.context, 'create', error);
			throw error;
		}
	}
	//#endregion
}

