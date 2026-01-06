import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum các loại thư mục upload
 * 
 * Để thêm/xóa thư mục: Chỉ cần thêm/xóa dòng trong enum này
 * Descriptions sẽ tự động cập nhật từ enum values
 */
export enum UploadFolderType {
    CATEGORY_BANNER = 'categories/banners',
    CATEGORY_THUMBNAIL = 'categories/thumbnails',
    PRODUCT_IMAGE = 'products/images',
	PRODUCT_DETAIL = 'products/details',
    AVATAR = 'avatars',
}

export enum TypeUpload {
	Customer = 'customers',
	Admin = 'admins',
}

/**
 * Helper function để tạo description từ enum values
 */
export const getUploadFolderDescription = (): string => {
	const folders = Object.values(UploadFolderType);
	return `Loại thư mục để lưu file (${folders.join(', ')}). Nếu không có, file sẽ lưu ở thư mục gốc`;
};

/**
 * DTO cho upload image với thư mục tự động tạo
 * Chỉ cho phép upload vào các thư mục được định nghĩa sẵn trong UploadFolderType
 */
export class UploadImageDto {

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	typeUpload?: string; // Customer | Admin
	
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	folder?: string; // avatar | banner | product

	
}

