import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaymentLinkDto {
	@IsNotEmpty()
	@IsNumber()
	orderId!: number;

	@IsOptional()
	@IsString()
	returnUrl?: string;

	@IsOptional()
	@IsString()
	cancelUrl!: string;
}
