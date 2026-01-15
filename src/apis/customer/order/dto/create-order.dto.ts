import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDetailDto {
	@IsNotEmpty()
	@IsNumber()
	productId!: number;

	@IsNotEmpty()
	@IsString()
	productName!: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	quantity!: number;

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	price!: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	originalPrice?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	discount?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	discountedPrice?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalAmount?: number;
}

export class CreateOrderDto {
	@IsNotEmpty()
	@IsNumber()
	customerId!: number;

	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderDetailDto)
	orderDetails!: OrderDetailDto[];

	@IsOptional()
	@IsNumber()
	@Min(0)
	subTotal?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalDiscount?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	shippingFee?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	totalAmount?: number;

	@IsOptional()
	@IsString()
	discountCode?: string;

	@IsOptional()
	@IsString()
	paymentMethod?: string;

	@IsOptional()
	@IsString()
	shippingAddress?: string;

	@IsOptional()
	@IsString()
	shippingPhone?: string;

	@IsOptional()
	@IsString()
	shippingName?: string;
}
