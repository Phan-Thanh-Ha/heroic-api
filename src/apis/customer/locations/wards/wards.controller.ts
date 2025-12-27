import { ApiGet, AppController, HTTP_STATUS_ENUM, ResponseMessage, wardSuccessTypes } from '@common';
import { Get, HttpCode, Param } from '@nestjs/common';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { ApiWardsFindByDistrictCode } from './swagger/get-wards-by-parencode.swagger';
import { WardsService } from './wards.service';
import { ApiWardsFindByWardId } from '../../customer/swagger/get-ward-by-wardid.swagger';
 
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
  @ApiGet('/:wardId', {
    summary: 'Lấy thông tin tỉnh/quan/xa của ward thông qua Id',
    swagger: ApiWardsFindByWardId()
  })
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_DISTRICT_CODE.message)
  async findWardsByWardId(@Param('wardId') wardId: number) {
    return wardId
    // return await this.wardsService.findWardsByWardId(wardId);
    
  }
  

  @ApiGet('/:districtCode', {
    summary: 'Lấy danh sách xã/phường theo mã quận/huyện',
    swagger: ApiWardsFindByDistrictCode()
  })
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_DISTRICT_CODE.message)
  async findWardsByDistrictCode(@Param('districtCode') districtCode: string) {
    return await this.wardsService.findWardsByDistrictCode(districtCode);
  }
}
