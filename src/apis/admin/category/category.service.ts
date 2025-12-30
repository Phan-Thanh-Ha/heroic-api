import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtPayloadAdmin } from 'src/jwt/jwt.interface';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { categoryErrorTypes } from 'src/common/code-type/category/category-error.code-type';
import { LoggerService } from '@logger';
import { QueryUserDto } from '../employees/dto/query.dto';

@Injectable()
export class CategoryService {
  private context = CategoryService.name;
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggerService,
  ) {}

  //#region Tạo danh mục mới
  async createCategory(createCategoryDto: CreateCategoryDto, userInfo: JwtPayloadAdmin) {
    try {
      const category = await this.categoryRepository.createCategory(createCategoryDto, userInfo);
      return category;
    } catch (error) {
      this.logger.error(CategoryService.name, error.message, error.stack);
      throw new BadRequestException({
        message: categoryErrorTypes().CATEGORY_CREATE_FAILED.message,
        error: categoryErrorTypes().CATEGORY_CREATE_FAILED.error_code,
      });
    }
  }
  //#endregion

  //#region Lấy danh sách danh mục
  async getListCategory(query: QueryUserDto) {
    try {
      const categories = await this.categoryRepository.getListCategory(query);
      return categories;
    } catch (error) {
      this.logger.error(CategoryService.name, error.message, error.stack);
      throw new BadRequestException(categoryErrorTypes().CATEGORY_GET_LIST_FAILED);
    }
  }
  //#endregion
}
