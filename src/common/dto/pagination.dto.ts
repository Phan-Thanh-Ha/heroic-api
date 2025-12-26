import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class DefaultQueryDto {
	@IsOptional()
	@IsString()
	q?: string;

	@IsOptional()
	@IsNumberString()
	limit?: string;

	@IsOptional()
	@IsNumberString()
	page?: string;

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
