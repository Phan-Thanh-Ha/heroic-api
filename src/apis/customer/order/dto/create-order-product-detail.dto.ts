import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderProductDetailDto {
    @IsNotEmpty()
    @IsNumber()
    id!: number;

    @IsNotEmpty()
    @IsNumber()
    productId!: number;

    @IsNotEmpty()
    @IsString()
    sku!: string;

    @IsOptional()
    @IsString()
    flavor?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsNotEmpty()
    @IsNumber()
    importPrice!: number;

    @IsNotEmpty()
    @IsNumber()
    retailPrice!: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsNotEmpty()
    @IsNumber()
    quantity!: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    isFlashSale?: boolean;

    @IsOptional()
    @IsBoolean()
    isOutOfStock?: boolean;
}
