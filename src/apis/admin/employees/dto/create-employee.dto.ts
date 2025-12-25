import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsInt, IsDate } from "class-validator";

export class CreateEmployeeDto {

    @IsString({ message: 'employeeCode phải là chuỗi' })
    @IsNotEmpty({ message: 'employeeCode không được để trống' })
    employeeCode!: string;

    @IsString({ message: 'fullName phải là chuỗi' })
    @IsNotEmpty({ message: 'fullName không được để trống' })
    fullName!: string;

    @IsString({ message: 'identity_number phải là chuỗi' })
    @IsNotEmpty({ message: 'identity_number không được để trống' })
    identityNumber!: string;

    @IsString({ message: 'phoneNumber phải là chuỗi' })
    @IsNotEmpty({ message: 'phoneNumber không được để trống' })
    phoneNumber!: string;

    @IsString({ message: 'email phải là chuỗi' })
    @IsNotEmpty({ message: 'email không được để trống' })
    email!: string;

    @IsNotEmpty({ message: 'birthday không được để trống' })
    @Type(() => Date) // Quan trọng: Chuyển chuỗi thành đối tượng Date
    @IsDate({ message: 'birthday phải là ngày tháng' })
    birthday!: Date;

    @IsInt()
    @IsNotEmpty({ message: 'positionId không được để trống' })
    positionId!: number;

    @IsInt()
    @IsNotEmpty({ message: 'departmentId không được để trống' })
    departmentId!: number;  

}
