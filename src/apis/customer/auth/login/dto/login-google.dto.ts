import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginGoogleDto {
    @IsString({ message: 'googleId phải là chuỗi' })
    @IsNotEmpty({ message: 'googleId không được để trống' })
    googleId!: string;

    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email!: string;

    @IsString({ message: 'firstName phải là chuỗi' })
    @IsNotEmpty({ message: 'firstName không được để trống' })
    firstName!: string;

    @IsString({ message: 'lastName phải là chuỗi' })
    @IsNotEmpty({ message: 'lastName không được để trống' })
    lastName!: string;

    @IsString({ message: 'fullName phải là chuỗi' })
    @IsNotEmpty({ message: 'fullName không được để trống' })
    fullName!: string;

    @IsString({ message: 'picture phải là chuỗi' })
    @IsNotEmpty({ message: 'picture không được để trống' })
    avatarUrl!: string;
}