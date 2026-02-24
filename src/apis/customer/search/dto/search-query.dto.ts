import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DefaultQueryDto } from "@common";

export class SearchQueryDto extends DefaultQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    s?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ApiPropertyOptional()
    @IsOptional()
    type?: string;

    @ApiPropertyOptional()
    @IsOptional()
    category?: string | string[];
}
