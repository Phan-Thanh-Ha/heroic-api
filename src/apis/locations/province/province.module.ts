import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaService } from '@prisma';
import { ProvinceController } from './province.controller';
import { ProvinceRepository } from './province.respository';
import { ProvinceService } from './province.service';

@Module({
  imports: [LoggerModule],
  controllers: [ProvinceController],
  providers: [ProvinceService, ProvinceRepository, PrismaService],
})
export class ProvinceModule {}
