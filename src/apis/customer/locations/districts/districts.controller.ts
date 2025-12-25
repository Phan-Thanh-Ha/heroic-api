import { Get, Param } from '@nestjs/common';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { districtsSuccessTypes } from 'src/common/code-type/districts/districts-success.code-type';
import { AppController, ResponseMessage } from '@common';
import { DistrictsService } from './districts.service';
import { ApiDistrictsFindByParentCode } from './swagger';


@AppController(APP_ROUTES.LOCATIONS.DISTRICTS)
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}
  @Get('/:provinceCode')
  @ApiDistrictsFindByParentCode()
  @ResponseMessage(districtsSuccessTypes().FINK_DISTRICTS_BY_PARENT_CODE.message)
  async findDistrictsByProvinceCode(@Param('provinceCode') provinceCode: string) {
    return await this.districtsService.findDistrictsByProvinceCode(provinceCode);
  }
}
