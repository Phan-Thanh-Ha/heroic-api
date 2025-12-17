
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateCustomerDto {
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
    
    // Avatar
    @IsString({ message: 'avatarUrl phải là chuỗi' })
    @IsNotEmpty({ message: 'avatarUrl không được để trống' })
    avatarUrl!: string;

    // Address
    @IsString({ message: 'address phải là chuỗi' })
    @IsNotEmpty({ message: 'address không được để trống' })
    address!: string;

    // Phone
    @IsString({ message: 'phoneNumber phải là chuỗi' })
    @IsNotEmpty({ message: 'phoneNumber không được để trống' })
    phoneNumber!: string;

    //Birthday
    @IsString({ message: 'birthday phải là chuỗi' })
    @IsNotEmpty({ message: 'birthday không được để trống' })
    birthday!: string;

    // Mật khẩu
    @IsString({ message: 'password phải là chuỗi' })
    @IsNotEmpty({ message: 'password không được để trống' })
    password!: string;

    //FacebookId
    facebookId!: string;

    //GoogleId
    googleId!: string;

    //ProvinceId
    @IsInt({ message: 'provinceId phải là số nguyên' })
    @IsNotEmpty({ message: 'provinceId không được để trống' })
    @Min(1, { message: 'provinceId phải lớn hơn 0' })
    provinceId!: number;

    //DistrictId
    @IsInt({ message: 'districtId phải là số nguyên' })
    @IsNotEmpty({ message: 'districtId không được để trống' })
    @Min(1, { message: 'districtId phải lớn hơn 0' })
    districtId!: number;

    //WardId
    @IsInt({ message: 'wardId phải là số nguyên' })
    @IsNotEmpty({ message: 'wardId không được để trống' })
    @Min(1, { message: 'wardId phải lớn hơn 0' })
    wardId!: number;

    //FullAddress
    @IsString({ message: 'fullAddress phải là chuỗi' })
    @IsNotEmpty({ message: 'fullAddress không được để trống' })
    fullAddress!: string;

    //TypeRegister
    @IsString({ message: 'typeRegister phải là chuỗi' })
    @IsNotEmpty({ message: 'typeRegister không được để trống' })
    typeRegister!: string;
}
