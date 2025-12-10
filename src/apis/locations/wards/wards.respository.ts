import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";

@Injectable()
export class WardsRepository {
    private context = WardsRepository.name;
    constructor(private readonly prisma: PrismaService, private readonly logger: LoggerService) {}

    async findWardsByDistrictCode(districtCode: string) {
        try {
            return await this.prisma.wards.findMany({
                where: { district_code: districtCode },
                select: {
                    id: true,
                    code: true,
                    name: true,
                    slug: true,
                    type: true,
                    name_with_type: true,
                },
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
}
