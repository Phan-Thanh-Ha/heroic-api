import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class DefaultQueryDto {
	@IsOptional()
	@IsString()
	q?: string; // Search query

	@IsOptional()
	@IsString()
	@Transform(() => '10')
	limit?: number; //Lấy 10 sản phẩm

	@IsOptional()
	@IsString()
	@Transform(() => '1')
	page?: number; //Trang 1

	@IsOptional()
	@IsString()
	search?: string; //Tim kiếm

	@IsOptional()
	@IsString()
	sort_by?: string; //Sắp xếp theo

	@IsOptional()
	@IsString()
	sort_type?: SORT_TYPE; //Loại sắp xếp
}

enum SORT_TYPE {
	asc = 'asc',
	ascending = 'ascending',
	desc = 'desc',
	descending = 'descending',
}
