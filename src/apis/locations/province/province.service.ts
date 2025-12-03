import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { ProvinceRepository } from './province.respository';

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
            return {
                message: 'Lấy tất cả tỉnh thành thành công',
                data: provinces,
                total: provinces.length,
                page: 1,
                limit: 10,
                totalPages: Math.ceil(provinces.length / 10),
            };
        } catch (error) {
            this.logger.error(this.context, 'getAllProvince', error);
            throw error;
        }
    }
}
