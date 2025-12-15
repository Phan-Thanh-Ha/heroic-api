import { PartialType } from '@nestjs/swagger';
import { CreateDistrictsDto } from './create-districts.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDistrictsDto extends PartialType(CreateDistrictsDto) {
    @IsString()
    @IsNotEmpty()
    code?: string;

    @IsString()
    @IsNotEmpty()
    name?: string;
}
