import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { ProvinceRepository } from './province.respository';
import { HTTP_STATUS_ENUM } from '@common';

@Injectable()
export class ProvinceService {
    private context = ProvinceService.name;
    constructor(
        private readonly provinceRepository: ProvinceRepository,
        private readonly logger: LoggerService
    ) {}

    async getAllProvince() {
        try {
            this.logger.log(this.context, 'getAllProvince');
            const provinces = await this.provinceRepository.getAllProvince();
            // Trả thẳng dữ liệu để interceptor bọc theo format chung:
            // {
            //   status: 'success',
            //   code: 200,
            //   message: 'Thành công',
            //   data: { result: [...] } (với dữ liệu là mảng)
            // }
            const result = {
                result: provinces,
                message: 'Lấy danh sách thành phố thành công',
            }
            return result;
        } catch (error) {
            this.logger.error(this.context, 'getAllProvince', error);
            throw error;
        }
    }
}
