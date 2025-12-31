import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyOtpDto {


    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email!: string;

    @IsString({ message: 'otp phải là chuỗi' })
    @IsNotEmpty({ message: 'otp không được để trống' })
    @Length(6, 6, { message: 'otp phải có 6 chữ số' })
    otp!: string;

}

