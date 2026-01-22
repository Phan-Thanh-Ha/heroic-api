import { LoggerService } from '@logger';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggerService,
  ) {
  }

  async getCategoryList() {
    return this.categoryRepository.getCategoryList();
  }
}
