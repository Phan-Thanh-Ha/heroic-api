import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {
    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email!: string;

    @IsString({ message: 'otpCode phải là chuỗi' })
    @IsNotEmpty({ message: 'otpCode không được để trống' })
    @Length(6, 6, { message: 'otpCode phải có đúng 6 chữ số' })
    otpCode!: string;
}

