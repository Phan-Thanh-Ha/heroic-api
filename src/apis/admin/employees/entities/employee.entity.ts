import { ApiProperty } from "@nestjs/swagger";

export class Employee {
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
        description: 'Mã nhân viên',
        example: 'NV001',
    })
    code!: string;

    @ApiProperty({
        description: 'Tên nhân viên',
        example: 'Nguyễn Văn A',
    })
    fullName!: string;

    @ApiProperty({
        description: 'Email',
        example: 'nguyenvana@example.com',
    })
    email!: string;

    @ApiProperty({
        description: 'Số điện thoại',
        example: '0909090909',
    })
    phoneNumber!: string;

    @ApiProperty({
        description: 'Trạng thái',
        example: 'true',
    })
    isActive!: boolean;

    @ApiProperty({
        description: 'Ngày tạo',
        example: '2021-01-01',
    })
    createdAt!: Date;

    @ApiProperty({
        description: 'Ngày cập nhật',
        example: '2021-01-01',
    })
    updatedAt!: Date;

    @ApiProperty({
        description: 'ID nhân viên tạo',
        example: '1',
    })
    createdById!: number;

    @ApiProperty({
        description: 'ID nhân viên cập nhật',
        example: '1',
    })
    updatedById!: number;
}
