import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class UpdateLoginDto extends PartialType(LoginDto) {}
