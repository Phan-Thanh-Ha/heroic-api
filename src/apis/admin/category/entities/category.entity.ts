import { ApiProperty } from '@nestjs/swagger';

export class Category {
    @ApiProperty({
        description: 'UUID của danh mục',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    uuid!: string;
    @ApiProperty({
        description: 'Tên của danh mục',
        example: 'Danh mục 1',
    })
    name!: string;
    @ApiProperty({
        description: 'Slug của danh mục',
        example: 'danh-muc-1',
    })
    slug!: string;
    @ApiProperty({
        description: 'Ảnh của danh mục',
        example: 'https://example.com/image.jpg',
    })
    image!: string;
    @ApiProperty({
        description: 'Mô tả của danh mục',
        example: 'Mô tả của danh mục 1',
    })
    description!: string;
    @ApiProperty({
        description: 'Trạng thái hoạt động của danh mục',
        example: true,
    })
    isActive!: boolean;
    @ApiProperty({
        description: 'Ngày tạo của danh mục',
        example: '2021-01-01',
    })
    createdAt!: Date;
    @ApiProperty({
        description: 'ID người tạo của danh mục',
        example: 1,
    })
    createdById!: number;
    @ApiProperty({
        description: 'Ngày cập nhật của danh mục',
        example: '2021-01-01',
    })
    updatedAt!: Date;
}