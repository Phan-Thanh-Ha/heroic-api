import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString( { message: 'code phải là chuỗi' })
    @IsNotEmpty( { message: 'code không được để trống' })
    code!: string;

    @IsString( { message: 'name phải là chuỗi' })
    @IsNotEmpty( { message: 'name không được để trống' })
    name!: string;
    
    @IsNotEmpty( { message: 'description không được để trống' })
    description!: string;

    @IsString( { message: 'image phải là chuỗi' })
    @IsNotEmpty( { message: 'image không được để trống' })
    image!: string;

    @IsNumber()
    @IsNotEmpty()
    importPrice!: number; // Giá nhập

    @IsNumber()
    @IsNotEmpty()
    retailPrice!: number; // Giá bán lẻ

    @IsNumber()
    @IsNotEmpty()
    quantity!: number; // Số lượng

    @IsNumber()
    @IsNotEmpty()
    categoryId!: number; // ID danh mục

    @IsString( { message: 'slug phải là chuỗi' })
    @IsNotEmpty( { message: 'slug không được để trống' })
    slug!: string;

}
