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
            return this.prisma.provinces.findMany({
                select: {
                    id: true,
                    code: true,
                    name: true,
                    slug: true,
                    type: true,
                    name_with_type: true,
                    sort_order: true,
                    lat: true,
                    long: true,
                    image: true,
                },
                orderBy: [
                    { sort_order: 'asc' },
                    { name: 'asc' },
                ],
            });
        } catch (error) {
            this.logger.error(this.context, 'getAllProvince', error);
            throw error;
        }
    }
}