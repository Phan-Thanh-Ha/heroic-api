import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { QueryWardsDto } from "./dto/query.dto";

@Injectable()
export class WardsRepository {
    private context = WardsRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

    async findWardsByDistrictCode(query: QueryWardsDto) {
        const { districtCode } = query;
        try {
            return await this.prisma.wards.findMany({
                where: { district_code: districtCode },
                orderBy: {
                    name: 'asc',
                },
            }); 
        }
        catch (error) {
            this.logger.error(this.context, 'findWardsByDistrictCode', error);
            throw error;
        }
    }


    async findWardsByWardId(wardId: number) {
        try {
            return await this.prisma.wards.findFirst({
                where: { id: wardId },
            
                
            }); 
            
        }
        catch (error) {
            this.logger.error(this.context, 'findWardsByDistrictCode', error);
            throw error;
        }
    }
}
