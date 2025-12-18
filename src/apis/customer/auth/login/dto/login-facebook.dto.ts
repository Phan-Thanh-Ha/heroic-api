import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginFacebookDto {
    @IsString({ message: 'facebookId phải là chuỗi' })
    @IsNotEmpty({ message: 'facebookId không được để trống' })
    facebookId!: string;

    @IsString({ message: 'fullName phải là chuỗi' })
    @IsNotEmpty({ message: 'fullName không được để trống' })
    fullName!: string;

    @IsString({ message: 'email phải là chuỗi' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'avatarUrl phải là chuỗi' })
    @IsNotEmpty({ message: 'avatarUrl không được để trống' })
    avatarUrl!: string;
}