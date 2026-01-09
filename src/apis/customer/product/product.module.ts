import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '@prisma';
import { ProductRepository } from './product.repository';
import { LoggerModule } from '@logger';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
