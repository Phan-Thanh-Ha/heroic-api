import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { DistrictsRepository } from './districts.respository';
import { QueryDistrictsDto } from './dto/query.dto';

@Injectable()
export class DistrictsService {
  private context = DistrictsService.name;
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly logger: LoggerService,
  ) {}

  async findDistrictsByProvinceCode(query: QueryDistrictsDto) {
    try {
      return await this.districtsRepository.findDistrictsByProvinceCode(query);
    } catch (error) {
      this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
      throw error;
    }
  }
}
