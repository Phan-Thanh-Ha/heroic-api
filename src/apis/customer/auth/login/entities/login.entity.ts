import { ApiProperty } from "@nestjs/swagger";

export class Login {
    @ApiProperty({
        description: 'Id',
        example: '1',
    })
    id!: number;

    @ApiProperty({
        description: 'UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    uuid!: string;

    @ApiProperty({
        description: 'Mã khách hàng',
        example: 'KH2512170001',
    })
    customerCode!: string;

    @ApiProperty({
        description: 'Tên khách hàng',
        example: 'Nguyễn Văn A',
    })
    fullName!: string;

    @ApiProperty({
        description: 'Ảnh đại diện',
        example: 'https://example.com/avatar.png',
    })
    avatarUrl!: string;

    @ApiProperty({
        description: 'Email',
        example: 'example@example.com',
    })
    email!: string;

    @ApiProperty({
        description: 'Số điện thoại',
    })
    phoneNumber!: string;

    @ApiProperty({
        description: 'Ngày sinh',
        example: '2025-01-01',
    })
    dateOfBirth!: Date;
    
    @ApiProperty({
        description: 'Điểm thưởng',
        example: 100,
    })
    loyaltyPoints!: number;

    @ApiProperty({
        description: 'Nhóm khách hàng',
    })
    customerGroupId!: number;

    @ApiProperty({
        description: 'Ngày tạo',
        example: '2025-01-01',
    })
    createdAt!: Date;

    @ApiProperty({
        description: 'Địa chỉ',
        example: '123 Đường ABC, Quận XYZ, Thành phố ABC',
    })
    address!: string;

    @ApiProperty({
        description: 'Giới tính',
        example: 'Nam',
    })
    gender!: string;
    
    @ApiProperty({
        description: 'Loại đăng nhập',
        example: 'facebook hoặc google hoặc email',
    })
    typeLogin!: 'facebook' | 'google' | 'email';
}
