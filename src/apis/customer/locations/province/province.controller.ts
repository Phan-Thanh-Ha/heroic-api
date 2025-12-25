import { LoggerService } from '@logger';
import { APP_ROUTES } from 'src/common/apis-routes/api.routes';
import { ApiGet } from 'src/common/decorators/api-endpoint.decorator';
import { AppController } from 'src/common/decorators/decorator';
import { ProvinceService } from './province.service';
import { ApiProvinceGetAll } from './swagger/get-all-province.swagger';
import { ResponseMessage } from 'src/common/decorators';
import { provinceSuccessTypes } from 'src/common/code-type/province/province-success.code-type';

@AppController(APP_ROUTES.LOCATIONS.PROVINCE)
export class ProvinceController {
    constructor(private readonly provinceService: ProvinceService) {}

    @ApiGet('', {
        summary: 'Lấy tất cả tỉnh thành',
        swagger: ApiProvinceGetAll()    
    })
    @ResponseMessage(provinceSuccessTypes().GET_ALL_PROVINCE.message)
    async getAllProvince() {
        return await this.provinceService.getAllProvince();
    }
}
