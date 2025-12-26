import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString({ message: 'username phải là chuỗi' })
    @IsNotEmpty({ message: 'employeeCode không được để trống' })
    @IsString({ message: 'username không hợp lệ' })
    username!: string;

    @IsString({ message: 'password phải là chuỗi' })
    @IsNotEmpty({ message: 'password không được để trống' })
    password!: string;
}
