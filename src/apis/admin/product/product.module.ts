import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '@prisma';
import { LoggerModule } from '@logger';
import { ProductRepository } from './product.repository';

@Module({
  imports: [PrismaModule,LoggerModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
