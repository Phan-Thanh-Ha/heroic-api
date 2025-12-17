import { IsNotEmpty, IsString } from "class-validator";

export class LoginGoogleDto {
    @IsString({ message: 'googleId phải là chuỗi' })
    @IsNotEmpty({ message: 'googleId không được để trống' })
    googleId!: string;
}