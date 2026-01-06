import { ApiProperty } from '@nestjs/swagger';

export class LoginEntity {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    uuid!: string;

    @ApiProperty({ example: '261345292' })
    code!: string;

    @ApiProperty({ example: 'https://ndqdiqunwhwrxwqrhmsz.supabase.co/storage/v1/object/public/heroic-storage/admin/employees/images/1767330489398-hydropure-4-5lbs_1701141512.jpg.webp' })
    avatar!: string;

    @ApiProperty({ example: 'Nguyễn Văn A' })
    fullName!: string;

    @ApiProperty({ example: 'nguyenvana@example.com' })
    email!: string;

    @ApiProperty({ example: '0909090909' })
    phoneNumber!: string;

    @ApiProperty({ example: true })
    isActive!: boolean;

    @ApiProperty({ example: '2025-01-01' })
    dob!: string;

    @ApiProperty({ example: 1 })
    positionId!: number;

    @ApiProperty({ example: 1 })
    departmentId!: number;

    @ApiProperty({ example: '1234567890' })
    identity_number!: string;

    @ApiProperty({ example: 'Hà Nội' })
    place_of_origin!: string;

    @ApiProperty({ example: 'Hà Nội' })
    place_of_residence!: string;

    @ApiProperty({ example: '1234567890' })
    cccdNumber!: string;

    @ApiProperty({ example: '2025-01-01' })
    createdAt!: string;

    @ApiProperty({ example: 1 })
    createdById!: number;

    @ApiProperty({ example: '2025-01-01' })
    updatedAt!: string;

    @ApiProperty({ example: 1 })
    updatedById!: number;

    @ApiProperty({ example: 1 })
    loginId!: number;

    @ApiProperty({ example: 'Phòng Kỹ thuật' })
    departmentName!: string;

    @ApiProperty({ example: 'Nhân viên' })
    positionName!: string;
}