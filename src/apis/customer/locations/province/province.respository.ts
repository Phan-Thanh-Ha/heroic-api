import { Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProvinceRepository {
    private context = ProvinceRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

    // Lấy danh sách thành phố
    async getAllProvince() {
        try {
            const provinces = await this.prisma.provinces.findMany();
            return ({
                    items: provinces,
                    total: provinces.length,
                })
        } catch (error) {
            this.logger.error(this.context, 'getAllProvince', error);
            throw error;
        }
    }
}