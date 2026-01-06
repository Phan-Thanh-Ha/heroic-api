import { JwtPayloadAdmin } from '@jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductRepository } from './product.repository';
import { QueryProductDto } from './dto';
import { productErrorTypes } from '@common';
import { LoggerService } from '@logger';

@Injectable()
export class ProductService {
  
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly loggerService: LoggerService
  ) {}

  async createProduct(createProductDto: CreateProductDto, user: JwtPayloadAdmin) {
    return await this.productRepository.createProduct(createProductDto, user);
  }

  async getListProduct(query: QueryProductDto) {
    try {
      const products = await this.productRepository.getListProduct(query);
      return products;
    } catch (error) {
      this.loggerService.error(ProductService.name, error.message, error.stack);
      throw new BadRequestException(productErrorTypes().PRODUCT_GET_LIST_FAILED.message);
    }
  }
}
