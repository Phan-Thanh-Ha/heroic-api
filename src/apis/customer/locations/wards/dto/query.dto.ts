import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { DefaultQueryDto } from "src/common/dto/pagination.dto";

export class QueryWardsDto extends DefaultQueryDto {
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional({ description: 'Mã quận/huyện' })
    districtCode?: string;
}