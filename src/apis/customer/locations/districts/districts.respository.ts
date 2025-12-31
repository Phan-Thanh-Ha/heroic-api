import { Injectable } from "@nestjs/common";
import { LoggerService } from "@logger";
import { PrismaService } from "@prisma";
import { QueryDistrictsDto } from "./dto/query.dto";

@Injectable()
export class DistrictsRepository {
    private context = DistrictsRepository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly logger: LoggerService,
    ) {}
    
    async findDistrictsByProvinceCode(query: QueryDistrictsDto) {
        try {
            this.logger.log(this.context, 'findDistrictsByProvinceCode', query);
            const districts = await this.prisma.districts.findMany({
                where: {
                    province_code: query.provinceCode,
                },
            });
            return ({
                    items: districts,
                    total: districts.length,
                })
        } catch (error) {
            this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
            throw error;
        }
    }
}
