import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @IsString({ message: 'code phải là chuỗi' })
    @IsNotEmpty({ message: 'code không được để trống' })
    code!: string;

    @IsString({ message: 'name phải là chuỗi' })
    @IsNotEmpty({ message: 'name không được để trống' })
    name!: string;
    
    @IsNotEmpty({ message: 'description không được để trống' })
    description!: string;

    @IsArray({ message: 'images phải là một mảng' })
    @IsString({ each: true, message: 'Mỗi ảnh trong danh sách phải là chuỗi URL' })
    @IsNotEmpty({ message: 'images không được để trống' })
    images!: string[]; 

    @IsNumber()
    @IsNotEmpty()
    importPrice!: number;

    @IsNumber()
    @IsNotEmpty()
    retailPrice!: number;

    @IsNumber()
    @IsNotEmpty()
    quantity!: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId!: number;

    @IsString({ message: 'slug phải là chuỗi' })
    @IsNotEmpty({ message: 'slug không được để trống' })
    slug!: string;
}