import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiPost, APP_ROUTES, AppController, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { ApiCreateCategorySwagger } from './swagger/create-category.swagger';
import { categorySuccessTypes } from 'src/common/code-type/category/category-success.code-type';

@AppController(APP_ROUTES.ADMIN.CATEGORY.CREATE)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiPost('create', {
    summary: 'Tạo danh mục mới',
    swagger: ApiCreateCategorySwagger(),
    response: CreateCategoryDto,
    status: HTTP_STATUS_ENUM.CREATED
  })
  @ResponseMessage(categorySuccessTypes().CATEGORY_CREATE_SUCCESS.message)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }
}
