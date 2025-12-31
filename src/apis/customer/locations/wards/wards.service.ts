import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { WardsRepository } from './wards.respository';
import { QueryWardsDto } from './dto/query.dto';

@Injectable()
export class WardsService {
  private context = WardsService.name;
  constructor(private readonly wardsRepository: WardsRepository, private readonly logger: LoggerService) { }
  // create(createWardDto: CreateWardDto) {
  //   return 'This action adds a new ward';
  // }

  // findAll() {
  //   return `This action returns all wards`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} ward`;
  // }

  // update(id: number, updateWardDto: UpdateWardDto) {
  //   return `This action updates a #${id} ward`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} ward`;
  // }
  async findWardsByDistrictCode(query: QueryWardsDto) {
    try {
      const wards = await this.wardsRepository.findWardsByDistrictCode(query);
      return ({
          items: wards,
          total: wards.length,
        })
    } catch (error) {
      this.logger.error(this.context, 'findWardsByDistrictCode', error);
      throw error;
    }
  };


  async findWardsByWardId(wardId: number) {
    try {
      return await this.wardsRepository.findWardsByWardId(wardId);
    } catch (error) {
      this.logger.error(this.context, 'findWardsByWardId', error);
      throw error;
    }
  }

}

