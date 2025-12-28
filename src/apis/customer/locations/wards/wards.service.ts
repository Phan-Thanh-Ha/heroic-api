import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { WardsRepository } from './wards.respository';
import { QueryWardsDto } from './dto/query.dto';

@Injectable()
export class WardsService {
  private context = WardsService.name;
  constructor(private readonly wardsRepository: WardsRepository, private readonly logger: LoggerService) {}
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
      // Trả thẳng danh sách để interceptor bọc:
      // data: { result: [...], total: n }
      return await this.wardsRepository.findWardsByDistrictCode(query);
    } catch (error) {
      this.logger.error(this.context, 'findWardsByDistrictCode', error);
      throw error;
    }
  };
   

   async findWardsByWardId (wardId : number){
    try {
      return await this.wardsRepository.findWardsByWardId(wardId);
    } catch (error) {
      this.logger.error(this.context, 'findWardsByWardId', error);
      throw error;
    }
   }
  
}

