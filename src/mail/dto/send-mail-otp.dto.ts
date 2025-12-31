import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SendMailOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    otp!: string;
}
