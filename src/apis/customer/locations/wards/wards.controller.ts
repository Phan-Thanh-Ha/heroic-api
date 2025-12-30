import { ApiGet, AppController, HTTP_STATUS_ENUM, ResponseMessage, wardSuccessTypes } from '@common';
import { Get, HttpCode, Param, Query } from '@nestjs/common';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { ApiWardsFindByDistrictCode } from './swagger/get-wards-by-parencode.swagger';
import { WardsService } from './wards.service';
import { ApiWardsFindByWardId } from '../../customer/swagger/get-ward-by-wardid.swagger';
import { QueryWardsDto } from './dto/query.dto';

@AppController(APP_ROUTES.CUSTOMER.LOCATIONS.WARDS)
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @ApiGet('/:wardId', {
    summary: 'Lấy thông tin tỉnh/quan/xa của ward thông qua Id',
    swagger: ApiWardsFindByWardId()
  })
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_WARD_ID.message)
  async findWardsByWardId(@Param('wardId') wardId: number) {
    return await this.wardsService.findWardsByWardId(wardId);
  }
  
  @ApiGet('', {
    summary: 'Lấy danh sách xã/phường theo mã quận/huyện',
    swagger: ApiWardsFindByDistrictCode()
  })
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_DISTRICT_CODE.message)
  async findWardsByDistrictCode(@Query() query: QueryWardsDto) {
    return await this.wardsService.findWardsByDistrictCode(query)
  }
}
