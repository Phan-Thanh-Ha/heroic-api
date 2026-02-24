import { AppController, APP_ROUTES, ApiGet } from '@common';
import { ApiSecurity } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@AppController(APP_ROUTES.CUSTOMER.SEARCH)
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @ApiGet('', {
        summary: 'Tìm kiếm tổng hợp (Sản phẩm, Danh mục)',
    })
    @ApiSecurity('JWT')
    async search(
        @Query() query: SearchQueryDto
    ) {
        console.log('query', query);
        // Lấy tất cả sản phẩm và danh mục
        return this.searchService.search(query);
    }
}
