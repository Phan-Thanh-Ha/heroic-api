import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { CreateOrderImageDto } from './create-order-image.dto';
import { CreateOrderProductDetailDto } from './create-order-product-detail.dto';

export class CreateOrderDetailDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProductDetailDto)
    productDetails?: CreateOrderProductDetailDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderImageDto)
    productImages?: CreateOrderImageDto[];
}
