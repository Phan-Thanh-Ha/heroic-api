import { Transform } from 'class-transformer';
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class DefaultQueryDto {
	@IsOptional()
	@IsString()
	q?: string;

	@IsOptional()
	@IsString()
	@Transform(() => '10') // Default limit is 10
	limit?: number;

	@IsOptional()
	@IsString() // Default page is 1
	@Transform(() => '1') // Default page is 1
	page?: number;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@IsString()
	sort_by?: string;

	@IsOptional()
	@IsString()
	sort_type?: SORT_TYPE;
}

enum SORT_TYPE {
	asc = 'asc',
	ascending = 'ascending',
	desc = 'desc',
	descending = 'descending',
}
