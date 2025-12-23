import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateAdminRegisterDto {
    @IsString({ message: 'code phải là chuỗi' })
    @IsNotEmpty({ message: 'code không được để trống' })
    code!: string;

    @IsString({ message: 'fullName phải là chuỗi' })
    @IsNotEmpty({ message: 'fullName không được để trống' })
    fullName!: string;
    
    
    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    @IsEmail({}, { message: 'email không hợp lệ' })
    email!: string;

    @IsString({ message: 'phoneNumber phải là chuỗi' })
    @IsNotEmpty({ message: 'phoneNumber không được để trống' })
    phoneNumber!: string;
    
}

