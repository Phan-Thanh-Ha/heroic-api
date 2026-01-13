import { ApiSecurity } from '@nestjs/swagger';
import { APP_ROUTES, ApiGet, AppController } from '@common';
import { CategoryService } from './category.service';
import { ApiCategoryListSwagger } from './swagger/category-list.swagger';

@AppController(APP_ROUTES.CUSTOMER.CATEGORY)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiGet('', {
    summary: 'Lấy danh sách danh mục',
    swagger: ApiCategoryListSwagger(),
  })
  @ApiSecurity('JWT')
  async getCategoryList() {
    return await this.categoryService.getCategoryList();
  }
}
