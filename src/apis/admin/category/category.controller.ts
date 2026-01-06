import { ApiDelete, ApiGet, ApiPatch, ApiPost, APP_ROUTES, AppController, GetUser, HTTP_STATUS_ENUM, ResponseMessage } from '@common';
import { JwtPayloadAdmin } from '@jwt';
import { LoggerService } from '@logger';
import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { categorySuccessTypes } from 'src/common/code-type/category/category-success.code-type';
import { QueryUserDto } from '../employees/dto/query.dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ApiGetListCategorySwagger } from './swagger';
import { ApiCreateCategorySwagger } from './swagger/create-category.swagger';
import { ApiToggleCategorySwagger } from './swagger/toggle-category.swagger';
import { ApiUpdateCategorySwagger } from './swagger/update-category.swagger';
@AppController(APP_ROUTES.ADMIN.CATEGORY)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService, 
    private readonly logger: LoggerService
  ) { }

  //#region Tạo danh mục mới
  @ApiPost('create', {
    summary: 'Tạo danh mục mới',
    swagger: ApiCreateCategorySwagger(),
    response: Category,
    status: HTTP_STATUS_ENUM.CREATED,
  })
  @ResponseMessage(categorySuccessTypes().CATEGORY_CREATE_SUCCESS.message)
  @ApiSecurity('JWT')
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
  })
  @ApiSecurity('JWT')
  @ResponseMessage(categorySuccessTypes().CATEGORY_GET_LIST_SUCCESS.message)
  async getListCategory(@Query() query: QueryUserDto) {
    return await this.categoryService.getListCategory(query);
  }
  //#endregion

  //#region Cập nhật danh mục
  
  @ApiPatch('update/:id', {
    summary: 'Cập nhật danh mục',
    swagger: ApiUpdateCategorySwagger(),
  })
  @ApiSecurity('JWT')
  @ResponseMessage(categorySuccessTypes().CATEGORY_UPDATE_SUCCESS.message)
  async updateCategory(
    @Req() req: Request, 
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userInfo = req.user as JwtPayloadAdmin;
    return await this.categoryService.updateCategory(updateCategoryDto, userInfo);
  }
  //#endregion

  //#region Xóa danh mục
  @ApiDelete('delete/:uuid', {
    summary: 'Xóa danh mục',
  })
  @ApiSecurity('JWT')
  @ResponseMessage(categorySuccessTypes().CATEGORY_DELETE_SUCCESS.message)
  async deleteCategory(
    @GetUser() user: JwtPayloadAdmin,
    @Param('uuid') uuid: string
  ) {
    this.logger.log(CategoryController.name, 'deleteCategory', uuid);
    return await this.categoryService.deleteCategory(uuid, user);
  }
  //#endregion

  //#region mở đóng danh mục
  @ApiPatch('toggle/:uuid', {
    summary: 'Mở đóng danh mục',
    swagger: ApiToggleCategorySwagger(),
  })
  @ApiSecurity('JWT')
  @ResponseMessage(categorySuccessTypes().CATEGORY_TOGGLE_SUCCESS.message)
  async toggleCategory(
    @GetUser() user: JwtPayloadAdmin, 
    @Param('uuid') uuid: string,
  ) {
    this.logger.debug(CategoryController.name, 'toggleCategory', uuid);
    return await this.categoryService.toggleActiveCategory(uuid, user);
  }
  //#endregion
}