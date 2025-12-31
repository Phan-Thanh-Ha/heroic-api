import { IsNotEmpty, IsString } from "class-validator";

export class VerifyOtpDto {
    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    email!: string;

    @IsString({ message: 'otp phải là chuỗi' })
    @IsNotEmpty({ message: 'otp không được để trống' })
    otp!: string;
}