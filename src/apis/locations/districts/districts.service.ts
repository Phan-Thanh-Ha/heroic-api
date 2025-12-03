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
  // create(createDistrictsDto: CreateDistrictsDto) {
  //   return 'This action adds a new districts';
  // }

  // findAll() {
  //   return `This action returns all districts`;
  // }

  async findDistrictsByProvinceCode(provinceCode: string) {
    try {
      return await this.districtsRepository.findDistrictsByProvinceCode(provinceCode);
    } catch (error) {
      this.logger.error(this.context, 'findDistrictsByProvinceCode', error);
      throw error;
    }
  }

  // update(id: number, updateDistrictsDto: UpdateDistrictsDto) {
  //   return `This action updates a #${id} districts`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} districts`;
  // }
}
