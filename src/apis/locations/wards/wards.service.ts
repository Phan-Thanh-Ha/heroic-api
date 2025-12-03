import { Injectable } from '@nestjs/common';
import { LoggerService } from '@logger';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { WardsRepository } from './wards.respository';

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
  async findWardsByDistrictCode(districtCode: string) {
    try {
      this.logger.log(this.context, 'findWardsByDistrictCode', districtCode);
      const data = await this.wardsRepository.findWardsByDistrictCode(districtCode);
      return {
        message: 'Lấy danh sách phường/xã thành công',
        data: data,
        total: data.length,
      };
    } catch (error) {
      this.logger.error(this.context, 'findWardsByDistrictCode', error);
      throw error;
    }
  }
}
