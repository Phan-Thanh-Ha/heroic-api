import { Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested
} from 'class-validator';

class ProductDetailDto {
    @IsString()
    @IsNotEmpty()
    sku!: string;

    @IsString()
    @IsNotEmpty()
    flavor!: string;

    @IsString()
    @IsNotEmpty()
    size!: string;

    @IsNumber()
    importPrice!: number;

    @IsNumber()
    retailPrice!: number;

    @IsNumber()
    discount!: number;

    @IsNumber()
    stock!: number;
}

// Class validate cho từng hình ảnh
class ProductImageDto {
    @IsString()
    @IsNotEmpty()
    image!: string;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    productCode!: string; // Thay 'code' bằng 'productCode' theo JSON của bạn

    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsNumber()
    @IsNotEmpty()
    brandId!: number;

    @IsNumber()
    @IsNotEmpty()
    originId!: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId!: number;

    @IsString()
    @IsNotEmpty()
    description!: string;

    // Validate mảng ProductDetails
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDetailDto)
    productDetails!: ProductDetailDto[];

    // Validate mảng ProductImages
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductImageDto)
    productImages!: ProductImageDto[];
}