import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SearchRepository } from './search.repository';


@Module({
    imports: [ProductModule, CategoryModule],
    controllers: [SearchController],
    providers: [SearchService, SearchRepository],
})
export class SearchModule { }
