import { IsBoolean, IsString } from "class-validator";

import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsString()
    @IsNotEmpty()
    banner!: string;

    @IsString()
    @IsNotEmpty()
    thumbnail!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

}
