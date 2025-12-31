import { ApiPropertyOptional } from "@nestjs/swagger";
import { DefaultQueryDto } from "src/common/dto/pagination.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class QueryDistrictsDto extends DefaultQueryDto {
    @IsString({ message: 'Mã tỉnh/thành phố phải là chuỗi' })
    @IsNotEmpty({ message: 'Mã tỉnh/thành phố không được để trống' })
    @ApiPropertyOptional({ description: 'Mã tỉnh/thành phố' })
    provinceCode?: string;
}