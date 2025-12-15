import { Module } from '@nestjs/common';
import { LoggerModule } from '@logger';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';
import { DistrictsRepository } from './districts.respository';
import { PrismaModule } from '@prisma';

@Module({
  imports: [LoggerModule, PrismaModule],
  controllers: [DistrictsController],
  providers: [DistrictsService, DistrictsRepository],
})
export class DistrictsModule {}
