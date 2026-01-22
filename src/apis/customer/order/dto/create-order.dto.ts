import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from './create-order-detail.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true }) // Validate mỗi phần tử trong mảng
  @Type(() => CreateOrderDetailDto)
  cartItems!: CreateOrderDetailDto[];

  // Thông tin thanh toán
  @IsNotEmpty()
  @IsString()
  paymentMethod!: string;

  @IsOptional()
  @IsString()
  discountCode?: string;

  // Phí vận chuyển
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  shippingFee!: number;

  // Tổng tiền hàng sau khi trừ giảm giá
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subTotal!: number;

  // Tổng giảm giá
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalDiscount!: number;

  // Tổng tiền
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsOptional()
  @IsString()
  orderCode?: string;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  shippingPhone?: string;

  @IsOptional()
  @IsString()
  shippingName?: string;

  @IsOptional()
  customerInfo?: any;
}
