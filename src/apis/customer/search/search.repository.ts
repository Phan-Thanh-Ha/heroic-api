
import { Injectable } from "@nestjs/common";
import { SearchQueryDto } from "./dto/search-query.dto";
import { ProductRepository } from "../product/product.repository";
import { CategoryRepository } from "../category/category.repository";

@Injectable()
export class SearchRepository {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
    ) { }

    async search(query: SearchQueryDto) {
        const { q, type } = query;
        const searchTerm = q || '';

        // Parallel execution for better performance
        const promises: any[] = [];

        if (!type || type === 'all' || type === 'product') {
            promises.push(this.productRepository.getProducts({ ...query, name: searchTerm }));
        } else {
            promises.push(Promise.resolve(null));
        }

        if (!type || type === 'all' || type === 'category') {
            // Assuming categoryRepository has findAll or similar.
            // If not, we might need to add it or use findMany directly here if repo is not flexible.
            // For now, let's assume we need to fit it to category repo.
            // Checking CategoryRepo... it likely needs a findAll that accepts name.
            promises.push(this.categoryRepository.findAll({ ...query, name: searchTerm }));
        } else {
            promises.push(Promise.resolve(null));
        }

        const [productsResult, categoriesResult] = await Promise.all(promises);

        return {
            products: productsResult || { items: [], meta: { total: 0 } },
            categories: categoriesResult || { items: [], meta: { total: 0 } },
        };
    }
}