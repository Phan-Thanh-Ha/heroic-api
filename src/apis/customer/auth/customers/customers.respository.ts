import { LoggerService } from "@logger";
import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { generateCustomerCode, generateUUID, parseBirthdayToDate } from "@utils";
import { CreateCustomerDto } from "./dto/create-customer.dto";

@Injectable()
export class CustomersRespository {

    private context = CustomersRespository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService
    ) { }

    //#region Kiểm tra email đã tồn tại chưa
    private async checkEmailExists(email: string) {
        try {
            const customerEmail = await this.prisma.customer.findUnique({
                where: {
                    email: email,
                },
            });
            return customerEmail;
        } catch (error) {
            this.loggerService.error(this.context, 'checkEmailExists', error);
            throw error;
        }
    }
    //#endregion

    //#region Tạo mới khách hàng
    private async createCustomer(createCustomerDto: CreateCustomerDto) {
        try {
            // Cần id trước rồi mới sinh được mã KHyyMMdd0001 (dựa trên id)
            const customer = await this.prisma.$transaction(async (tx) => {
                // 1. Insert trước để lấy id
                const createdCustomer = await tx.customer.create({
                    data: {
                        uuid: generateUUID(),
                        customerCode: '',
                        firstName: createCustomerDto.firstName,
                        lastName: createCustomerDto.lastName,
                        fullName: createCustomerDto.fullName,
                        avatarUrl: createCustomerDto.avatarUrl,
                        email: createCustomerDto.email,
                        address: createCustomerDto.address,
                        phoneNumber: createCustomerDto.phoneNumber,
                        dateOfBirth: parseBirthdayToDate(createCustomerDto.birthday),
                        password: createCustomerDto.password,
                    },
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

            return customer;
        } catch (error) {
            this.loggerService.error(this.context, 'createCustomer', error);
            throw error;
        }
    }
    //#endregion

    //#region Tạo mới khách hàng
    async create(createCustomerDto: CreateCustomerDto) {
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingCustomer = await this.checkEmailExists(createCustomerDto.email);
            if (existingCustomer) {
                throw new ConflictException('Email đã tồn tại');
            }
            // Tạo mới khách hàng với mã KHyyMMdd0001, KHyyMMdd0002, ...
            const newCustomer = await this.createCustomer(createCustomerDto);
            return newCustomer;
        } catch (error) {
            this.loggerService.error(this.context, 'create', error);
            throw error;
        }
    }
    //#endregion
}