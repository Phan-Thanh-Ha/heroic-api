import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for getting notifications list
 */
export class GetNotificationsDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    userId?: number;

    @IsOptional()
    isRead?: boolean;
}