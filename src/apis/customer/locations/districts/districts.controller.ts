import { ApiGet, AppController, Public, ResponseMessage } from '@common';
import { ApiSecurity } from '@nestjs/swagger';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { districtsSuccessTypes } from 'src/common/code-type/districts/districts-success.code-type';
import { DistrictsService } from './districts.service';
import { QueryDistrictsDto } from './dto/query.dto';
import { ApiDistrictsFindByParentCode } from './swagger';
import { Query } from '@nestjs/common';

@AppController(APP_ROUTES.CUSTOMER.LOCATIONS.DISTRICTS)
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}
  @ApiGet('', {
    summary: 'Lấy danh sách quận/huyện theo mã tỉnh/thành phố',
    swagger: ApiDistrictsFindByParentCode()
  })
  @ApiSecurity('JWT') // Để có thể swagger gọi được api này
  @Public() // Để có thể gọi được api này không cần token
  @ResponseMessage(districtsSuccessTypes().FINK_DISTRICTS_BY_PARENT_CODE.message)
  async findDistrictsByProvinceCode(@Query() query: QueryDistrictsDto) {
    return await this.districtsService.findDistrictsByProvinceCode(query);  
  }
}
