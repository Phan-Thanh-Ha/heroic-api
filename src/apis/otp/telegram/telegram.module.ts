import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { PrismaModule } from '@prisma';

@Module({
  imports: [PrismaModule],
  controllers: [TelegramController],
  providers: [TelegramService], // PHẢI CÓ DÒNG NÀY
  exports: [TelegramService],
})
export class TelegramModule {}
