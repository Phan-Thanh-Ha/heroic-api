import { Controller, Get  } from '@nestjs/common';
import { ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { ApiTags } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { LoggerService } from '@logger';
import { ApiProvinceGetAll } from './swagger/get-all-province.swagger';
@Controller(ROUTER_ENUM.PROVINCE_CITY)
@ApiTags(ROUTER_TAG_ENUM.PROVINCE_CITY)
export class ProvinceController {
    private context = ProvinceController.name;
    constructor(private readonly provinceService: ProvinceService, private readonly logger: LoggerService) {}

    //URL: /api/v1/locations/province/city
    @Get()
    @ApiProvinceGetAll()
    async getAllProvince() {
        this.logger.log(this.context, 'getAllProvince');
        return await this.provinceService.getAllProvince();
    }
}
