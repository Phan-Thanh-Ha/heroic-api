import { Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CustomerRepository {
    private context = CustomerRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) { }

    // Lấy danh sách thành phố
    async getCustomerList() {
        try {
            return await this.prisma.customer.findMany(
                {
                    omit: {
                        password: true
                    },
                    include: {

                        province: {
                            select: { name: true },
                        },
                        district: {
                            select: { name: true },
                        },
                        ward: {
                            select: { name: true },
                        },
                    },
                }
            );
        } catch (error) {
            this.logger.error(this.context, 'getCustomerList', error);
            throw error;
        }
    }
}