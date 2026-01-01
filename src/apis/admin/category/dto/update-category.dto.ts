import { PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {

    @IsInt({message: 'ID phải là một số nguyên',})
    @IsNotEmpty({message: 'ID không được để trống',})
    id!: number;

    @IsString({message: 'UUID phải là một chuỗi',})
    @IsNotEmpty({message: 'UUID không được để trống',})
    uuid!: string;
}
