import { ApiGet, ApiPost, APP_ROUTES, AppController, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { categorySuccessTypes } from 'src/common/code-type/category/category-success.code-type';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiCreateCategorySwagger } from './swagger/create-category.swagger';
import { JwtPayloadAdmin } from '@jwt';
import { ApiGetListCategorySwagger } from './swagger';
import { Category } from './entities/category.entity';
import { QueryUserDto } from '../employees/dto/query.dto';
import { Query } from '@nestjs/common';
@AppController(APP_ROUTES.ADMIN.CATEGORY)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //#region Tạo danh mục mới
  @ApiPost('create', {
    summary: 'Tạo danh mục mới',
    swagger: ApiCreateCategorySwagger(),
    response: CreateCategoryDto,
    status: HTTP_STATUS_ENUM.CREATED
  })
  @ResponseMessage(categorySuccessTypes().CATEGORY_CREATE_SUCCESS.message)
  @UseGuards(JwtAuthGuard)
  async createCategory(
    @Req() req: Request, 
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    // req.user chứa thông tin đã giải mã từ token (id, email, role...)
    const userInfo = req.user as JwtPayloadAdmin; 
    
    // Truyền user hoặc user.id vào service để lưu người tạo
    return await this.categoryService.createCategory(createCategoryDto, userInfo);
  }
  //#endregion

  //#region Lấy danh sách danh mục
  @ApiGet('', {
    summary: 'Lấy danh sách danh mục',
    swagger: ApiGetListCategorySwagger(),
    response: [Category],
    status: HTTP_STATUS_ENUM.OK,
  })
  //#endregion
  @UseGuards(JwtAuthGuard)
  @ResponseMessage(categorySuccessTypes().CATEGORY_GET_LIST_SUCCESS.message)
  async getListCategory(@Query() query: QueryUserDto) {
    return await this.categoryService.getListCategory(query);
  }
}
