import { Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "@prisma";

@Injectable()
export class DistrictsRepository {
    private context = DistrictsRepository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {}
    
    async findDistrictsByProvinceCode(provinceCode: string) {
        try {
            this.logger.log(this.context, 'findDistrictsByProvinceCode', provinceCode);
            return await this.prisma.districts.findMany({
            where: {
                province_code: provinceCode,
            },
            select: {
                id: true,
                code: true,
                name: true,
                slug: true,
                type: true,
                name_with_type: true,
                path: true,
                path_with_type: true,
                province_code: true,
            },
            orderBy: {
                    name: 'asc',
                },
            });
        } catch (error) {
            this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
            throw error;
        }
    }
}
