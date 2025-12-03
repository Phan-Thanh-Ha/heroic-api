import { LoggerModule } from '@logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma';
import { ProvinceController } from './province.controller';
import { ProvinceRepository } from './province.respository';
import { ProvinceService } from './province.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [ProvinceController],
  providers: [ProvinceService, ProvinceRepository],
})
export class ProvinceModule {}
