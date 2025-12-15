import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { WardsService } from './wards.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { LoggerService } from '@logger';
import { ApiWardsFindByDistrictCode } from './swagger/get-wards-by-parencode.swagger';
import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM, SWAGGER_TAG_ENUM } from '@common';
import { ApiTags } from '@nestjs/swagger';

@Controller(ROUTER_ENUM.WARDS)
@ApiTags(SWAGGER_TAG_ENUM.CUSTOMER, ROUTER_TAG_ENUM.WARDS)
export class WardsController {
  private context = WardsController.name;
  constructor(private readonly wardsService: WardsService, private readonly logger: LoggerService) {}

  // @Post()
  // create(@Body() createWardDto: CreateWardDto) {
  //   return this.wardsService.create(createWardDto);
  // }

  // @Get()
  // findAll() {
  //   return this.wardsService.findAll();
  // }

  //URL: /api/v1/locations/wards/:districtCode
  @Get('/:districtCode')
  @HttpCode(HTTP_STATUS_ENUM.OK)
  @ApiWardsFindByDistrictCode()
  async findWardsByDistrictCode(@Param('districtCode') districtCode: string) {
    return await this.wardsService.findWardsByDistrictCode(districtCode);
  }
}
