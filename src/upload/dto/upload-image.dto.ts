import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum các loại thư mục upload
 * 
 * Để thêm/xóa thư mục: Chỉ cần thêm/xóa dòng trong enum này
 * Descriptions sẽ tự động cập nhật từ enum values
 */
export enum UploadFolderType {
	AVATAR = 'avatar',
	BANNER = 'banner',
	PRODUCT = 'product',
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
	@ApiPropertyOptional({
		enum: UploadFolderType,
		description: getUploadFolderDescription(),
		example: UploadFolderType.AVATAR,
	})
	@IsOptional()
	@IsEnum(UploadFolderType, {
		message: `folder phải là một trong các folder được định nghĩa sẵn`,
	})
	folder?: UploadFolderType;
	

	// Mã Khách Hàng
	@ApiPropertyOptional({
		description: 'Mã Khách Hàng',
		example: 'KH2512170001',
	})
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	customerCode?: string;
}

