import { ApiGet, AppController, Public, ResponseMessage, wardSuccessTypes } from '@common';
import { Param, Query } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { ApiWardsFindByWardId } from '../../customer/swagger/get-ward-by-wardid.swagger';
import { QueryWardsDto } from './dto/query.dto';
import { ApiWardsFindByDistrictCode } from './swagger/get-wards-by-parencode.swagger';
import { WardsService } from './wards.service';

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
  @ApiSecurity('JWT') // Để có thể swagger gọi được api này
  @Public() // Để có thể gọi được api này không cần token
  @ResponseMessage(wardSuccessTypes().FIND_WARDS_BY_DISTRICT_CODE.message)
  async findWardsByDistrictCode(@Query() query: QueryWardsDto) {
    return await this.wardsService.findWardsByDistrictCode(query)
  }
}
