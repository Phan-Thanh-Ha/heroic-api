import { DefaultQueryDto } from '@common';
import { IsBoolean, IsBooleanString, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUserDto extends DefaultQueryDto {
	@IsOptional()
	@IsString()
	_id?: string | Object;

	@IsOptional()
	@IsString()
	CCCDNumber?: string | Object;

	@IsOptional()
	@IsString()
	customerCode?: string | Object;

	@IsOptional()
	@IsString()
	fullName?: string | Object;

	@IsOptional()
	@IsString()
	phone?: string | Object;

	@IsOptional()
	@IsString()
	email?: string | Object;

	@IsOptional()
	@IsString()
	gender?: string | Object;

	@IsOptional()
	@IsDateString()
	birthday?: string | Object;

	@IsOptional()
	@IsString()
	identityNumber?: string | Object;

	@IsOptional()
	@IsString()
	positionId?: string | Object;

	@IsOptional()
	@IsString()
	departmentId?: string | Object;

	// Base ------------------------

	@IsOptional()
	@IsBoolean()
	isActive?: boolean | Object;

	@IsOptional()
	@IsDateString()
	createdAt?: Date | Object;

	@IsOptional()
	@IsDateString()
	updatedAt?: Date | Object;

	@IsOptional()
	@IsNumber()
	createdById?: number | Object;

	@IsOptional()
	@IsNumber()
	updatedById?: number | Object;
}
