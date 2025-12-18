import { PartialType } from '@nestjs/swagger';
import { CreateAdminRegisterDto } from './create-register.dto';

export class UpdateRegisterDto extends PartialType(CreateAdminRegisterDto) {}

