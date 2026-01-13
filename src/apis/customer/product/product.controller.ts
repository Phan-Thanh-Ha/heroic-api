import { ApiGet } from '@common';
import { Param } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { APP_ROUTES } from '@common';
import { AppController } from '@common';
import { ProductService } from './product.service';
import { ApiGetProductBySlug } from './swagger/get-product-by-slug.swagger';

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
