import { DefaultQueryDto } from '@common';
import { IsBoolean, IsBooleanString, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryUserDto extends DefaultQueryDto {
	id?: string;

	CCCDNumber?: string;


	customerCode?: string;


	fullName?: string;

	phone?: string;

	email?: string;

	gender?: string;

	birthday?: string;

	identityNumber?: string;

	positionId?: string;

	departmentId?: string;


	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
	createdById?: number;
	updatedById?: number;
}
