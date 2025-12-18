import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { DistrictsRepository } from './districts.respository';

@Injectable()
export class DistrictsService {
  private context = DistrictsService.name;
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly logger: LoggerService,
  ) {}

  async findDistrictsByProvinceCode(provinceCode: string) {
    try {
      return await this.districtsRepository.findDistrictsByProvinceCode(provinceCode);
    } catch (error) {
      this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
      throw error;
    }
  }
}
