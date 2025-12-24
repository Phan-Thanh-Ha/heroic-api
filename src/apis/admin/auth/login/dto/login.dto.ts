import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString({ message: 'employeeCode phải là chuỗi' })
    @IsNotEmpty({ message: 'employeeCode không được để trống' })
    @IsString({ message: 'employeeCode không hợp lệ' })
    employeeCode!: string;

    @IsString({ message: 'password phải là chuỗi' })
    @IsNotEmpty({ message: 'password không được để trống' })
    password!: string;
}
