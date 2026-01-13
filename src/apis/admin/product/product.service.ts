import { productErrorTypes } from '@common';
import { JwtPayloadAdmin } from '@jwt';
import { LoggerService } from '@logger';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly loggerService: LoggerService
  ) { }

  //#region Create Product
  async createProduct(createProductDto: CreateProductDto, user: JwtPayloadAdmin) {
    return await this.productRepository.createProduct(createProductDto, user);
  }
  //#endregion

  //#region Get List Product
  async getListProduct(query: QueryProductDto) {
    try {
      const products = await this.productRepository.getListProduct(query);
      return products;
    } catch (error) {
      this.loggerService.error(ProductService.name, error.message, error.stack);
      throw new BadRequestException(productErrorTypes().PRODUCT_GET_LIST_FAILED.message);
    }
  }
  //#endregion

  //#region Update Product
  async updateProduct(productId: number, updateProductDto: UpdateProductDto, user: JwtPayloadAdmin) {
    return await this.productRepository.updateProduct(productId, updateProductDto, user);
  }
  //#endregion
}
