import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';


//PartialType
export class UpdateLoginDto extends PartialType(LoginDto) {}
