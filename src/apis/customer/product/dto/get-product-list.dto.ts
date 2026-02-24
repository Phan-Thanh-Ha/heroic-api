import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { DefaultQueryDto } from "@common";

export class GetProductListDto extends DefaultQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ApiPropertyOptional()
    @IsOptional()
    category?: string | string[];
}
