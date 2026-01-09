import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AppController } from 'src/common/decorators/decorator';
import { APP_ROUTES } from 'src/common/apis-routes';
import { ApiGet } from '@common';
import { ApiGetProductBySlug } from './swagger/get-product-by-slug.swagger';
import { ApiSecurity } from '@nestjs/swagger';

@AppController(APP_ROUTES.CUSTOMER.PRODUCT)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiGet(':slug', {
      summary: 'Lấy thông tin sản phẩm theo slug',
      swagger: ApiGetProductBySlug(),
    })
    @ApiSecurity('JWT')
    async ApiGetProductBySlug(
      @Param('slug') slug: string
    ){
      return this.productService.ApiGetProductBySlug(slug);
    }
}
