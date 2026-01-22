import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderImageDto {
  @IsNotEmpty()
  @IsNumber()
  id!: number;

  @IsNotEmpty()
  @IsNumber()
  productId!: number;

  @IsNotEmpty()
  @IsString()
  image!: string;

  @IsNotEmpty()
  @IsNumber()
  quantity!: number;
}
