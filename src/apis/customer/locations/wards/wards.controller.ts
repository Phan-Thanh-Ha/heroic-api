import { ApiGet, AppController, HTTP_STATUS_ENUM, ResponseMessage, wardSuccessTypes } from '@common';
import { Get, HttpCode, Param } from '@nestjs/common';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { ApiWardsFindByDistrictCode } from './swagger/get-wards-by-parencode.swagger';
import { WardsService } from './wards.service';
 
@AppController(APP_ROUTES.LOCATIONS.WARDS)
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  // @Post()
  // create(@Body() createWardDto: CreateWardDto) {
  //   return this.wardsService.create(createWardDto);
  // }

  // @Get()
  // findAll() {
  //   return this.wardsService.findAll();
  // }

  @ApiGet('/:districtCode', {
    summary: 'Lấy danh sách xã/phường theo mã quận/huyện',
    swagger: ApiWardsFindByDistrictCode()
  })
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_DISTRICT_CODE.message)
  async findWardsByDistrictCode(@Param('districtCode') districtCode: string) {
    return await this.wardsService.findWardsByDistrictCode(districtCode);
  }
}
