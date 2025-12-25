// src/register/entities/register.entity.ts
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEntity {
    @ApiProperty({
        description: 'Email',
        example: 'example@example.com',
    })
    email!: string;

    @ApiProperty({
        description: 'Tên',
        example: 'Nguyễn Văn A',
    })
    firstName!: string;

    @ApiProperty({
        description: 'Họ',
        example: 'Nguyễn Văn B',
    })
    lastName!: string;

    @ApiProperty({
        description: 'Tên đầy đủ',
        example: 'Nguyễn Văn A B',
    })
    fullName!: string;
}