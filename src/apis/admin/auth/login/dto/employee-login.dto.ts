import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmployeeLoginDto {
    @IsString({ message: 'username phải là chuỗi' })
    @IsNotEmpty({ message: 'username không được để trống' })
    username!: string;

    @IsString({ message: 'password phải là chuỗi' })
    @IsNotEmpty({ message: 'password không được để trống' })
    password!: string;
}
