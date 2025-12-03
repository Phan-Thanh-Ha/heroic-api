import { Module } from '@nestjs/common';
import { LoggerModule } from '@logger';
import { PrismaModule } from '@prisma';
import { WardsController } from './wards.controller';
import { WardsRepository } from './wards.respository';
import { WardsService } from './wards.service';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [WardsController],
  providers: [WardsService, WardsRepository],
})
export class WardsModule {}
