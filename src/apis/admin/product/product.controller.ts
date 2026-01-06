import { ApiGet, ApiPost, APP_ROUTES, AppController, GetUser, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { JwtPayloadAdmin } from '@jwt';
import { Body, Query } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { productSuccessCode } from 'src/common/code-type/product/product-success.code-type';
import { QueryProductDto } from './dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ApiGetListProductSwagger } from './swagger';
import { ApiCreateProductSwagger } from './swagger/create-product.swagger';
@AppController(APP_ROUTES.ADMIN.PRODUCT)
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  
  /**
   * Tạo sản phẩm
   * @param createProductDto - Thông tin sản phẩm
   * @param user - Thông tin người dùng
   * @returns 
   */
  @ApiPost('create', {
    summary: 'Tạo sản phẩm',
    swagger: ApiCreateProductSwagger(),
    status: HTTP_STATUS_ENUM.CREATED,
  })
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: JwtPayloadAdmin,
  ) {
    return await this.productService.createProduct(createProductDto, user);
  }

  /**
   * Lấy danh sách sản phẩm
   * @param query - Thông tin tìm kiếm
   * @returns 
   */
  @ApiGet('list', {
    summary: 'Lấy danh sách sản phẩm',
    swagger: ApiGetListProductSwagger(),
    response: [ProductEntity],
    status: HTTP_STATUS_ENUM.OK,
  })
  @ApiSecurity('JWT')
  @ResponseMessage(productSuccessCode().PRODUCT_GET_LIST_SUCCESS.message)
  async getListProduct(@Query() query: QueryProductDto) {
    return await this.productService.getListProduct(query);
  }
}
