import { IsNotEmpty, IsString } from "class-validator";

export class CreateDistrictsDto {
    @IsString()
    @IsNotEmpty()
    code?: string;

    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    slug?: string;
}
