import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email!: string;

    @IsString({ message: 'password phải là chuỗi' })
    password?: string;
    
    @IsOptional()
    @IsString({ message: 'otpMethod phải là chuỗi' })
    @IsNotEmpty({ message: 'otpMethod không được để trống' })
    otpMethod?: 'email' | 'discord' | 'telegram';

}
