import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM, SWAGGER_TAG_ENUM } from '@common';
import { LoggerService } from '@logger';
import { DistrictsService } from './districts.service';
import { ApiDistrictsFindByParentCode } from './swagger';

@Controller(ROUTER_ENUM.DISTRICTS)
@ApiTags(SWAGGER_TAG_ENUM.WEBSITE, ROUTER_TAG_ENUM.DISTRICTS)
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

  // @Post()
  // create(@Body() createDistrictsDto: CreateDistrictsDto) {
  //   return this.districtsService.create(createDistrictsDto);
  // }

  // @Get()
  // findAll() {
  //   return this.districtsService.findAll();
  // }

  //URL: /api/v1/locations/districts/:parentCode
  @Get('/:provinceCode')
  @HttpCode(HTTP_STATUS_ENUM.OK)
  @ApiDistrictsFindByParentCode()
  async findDistrictsByProvinceCode(@Param('provinceCode') provinceCode: string) {
    try {
    this.logger.log(this.context, 'findDistrictsByProvinceCode', provinceCode);
    const data = await this.districtsService.findDistrictsByProvinceCode(provinceCode);
    return {
      message: '',
      data: data,
      total: data.length,
    };
    } catch (error) {
      this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
      throw error;
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDistrictsDto: UpdateDistrictsDto) {
  //   return this.districtsService.update(+id, updateDistrictsDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.districtsService.remove(+id);
  // }
}
