import { Injectable } from '@nestjs/common';
import { ProvinceRepository } from './province.respository';

@Injectable()
export class ProvinceService {
    constructor(
        private readonly provinceRepository: ProvinceRepository,
    ) {}

    async getAllProvince() {
        return await this.provinceRepository.getAllProvince();
    }
}