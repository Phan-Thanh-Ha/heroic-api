import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    id!: number;

    @IsArray({ message: 'images phải là mảng' })
    @IsNotEmpty({ message: 'images không được để trống' })
    @IsString({ each: true, message: 'mỗi phần tử của images phải là string' })
    images!: string[]; 
}
