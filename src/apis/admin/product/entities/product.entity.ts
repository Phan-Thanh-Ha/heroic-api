import { ApiProperty } from "@nestjs/swagger";

export class ProductEntity {
    id!: number;
    @ApiProperty({
        description: 'UUID của sản phẩm',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    uuid!: string;
    @ApiProperty({
        description: 'Mã sản phẩm',
        example: 'NB-HYDRO-5-CHOC',
    })
    code!: string;
    @ApiProperty({
        description: 'Tên sản phẩm',
        example: 'NB-HYDRO-5-CHOC',
    })
    name!: string;
    @ApiProperty({
        description: 'Mô tả sản phẩm',
        example: 'NB-HYDRO-5-CHOC',
    })  
    description!: string;
    @ApiProperty({
        description: 'Ảnh sản phẩm',
        example: 'https://example.com/image.jpg',
    })
    image!: string;
    @ApiProperty({
        description: 'Giá sản phẩm',
        example: 100000,
    })
    importPrice!: number;
    @ApiProperty({
        description: 'Giá sản phẩm',
        example: 100000,
    })
    @ApiProperty({
        description: 'Giá sản phẩm',
        example: 100000,
    })
    retailPrice!: number;
    @ApiProperty({
        description: 'Giảm giá sản phẩm',
        example: 100000,
    })
    discount!: number;
    @ApiProperty({
        description: 'Số lượng sản phẩm',
        example: 100,
    })
    quantity!: number;
    @ApiProperty({
        description: 'Trạng thái hoạt động của sản phẩm',
        example: true,
    })
    isActive!: boolean;
    @ApiProperty({
        description: 'Ngày tạo của sản phẩm',
        example: '2021-01-01',
    })
    createdAt!: Date;
    @ApiProperty({
        description: 'Ngày cập nhật của sản phẩm',
        example: '2021-01-01',
    })
    updatedAt!: Date;
    @ApiProperty({
        description: 'ID người tạo của sản phẩm',
        example: 1,
    })
    createdById!: number;
    @ApiProperty({
        description: 'ID người cập nhật của sản phẩm',
        example: 1,
    })
    updatedById!: number;
}
