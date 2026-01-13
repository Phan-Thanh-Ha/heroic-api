import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;

    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsOptional()
    type?: string;

    @IsNumber()
    @IsOptional()
    customerId?: number;

    @IsString()
    @IsOptional()
    customerCode?: string;
}
