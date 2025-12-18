import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import { LoggerService } from '@logger';
import { DistrictsService } from './districts.service';
import { ApiDistrictsFindByParentCode } from './swagger';

@Controller(ROUTER_ENUM.LOCATIONS.DISTRICTS)
@ApiTags(ROUTER_TAG_ENUM.LOCATIONS.DISTRICTS)
@ApiParam({
  name: 'provinceCode',
  type: String,
  required: true,
})
export class DistrictsController {
  private context = DistrictsController.name;
  constructor(
    private readonly districtsService: DistrictsService,
    private readonly logger: LoggerService,
  ) {}
  //URL: /api/v1/locations/districts/:parentCode
  @Get('/:provinceCode')
  @HttpCode(HTTP_STATUS_ENUM.OK)
  @ApiDistrictsFindByParentCode()
  async findDistrictsByProvinceCode(@Param('provinceCode') provinceCode: string) {
    try {
      this.logger.log(this.context, 'findDistrictsByProvinceCode', provinceCode);
      return await this.districtsService.findDistrictsByProvinceCode(provinceCode);
    } catch (error) {
      this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
      throw error;
    }
  }
}
