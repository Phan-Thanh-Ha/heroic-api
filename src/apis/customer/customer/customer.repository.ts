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
             const takeCustomerList = await this.prisma.customer.findMany(
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
            const customerList = takeCustomerList.map( (item) => {
                 return {...item,
                    province: item.province?.name,
                    district: item.district?.name,
                    ward: item.ward?.name

                 }
                //  return {...takeCustomerList 
                //     province : takeCustomerList[0].province?.name
                //  }
            } )
            return customerList
        } catch (error) {
            this.logger.error(this.context, 'getCustomerList', error);
            throw error;
        }
    }
}