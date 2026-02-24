import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../category/category.repository';
import { ProductRepository } from '../product/product.repository';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async search(query: SearchQueryDto) {
        const { q } = query;
        console.log(query);
        // const searchTerm = q || '';
        // const products = await this.productRepository.findAll({ ...query, name: searchTerm });
        // const categories = await this.categoryRepository.findAll({ ...query, name: searchTerm });
        // return {
        //     products,
        //     categories,
        // };
    }
}
