import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UploadFolderType } from '../dto/upload-image.dto';

/**
 * Swagger decorator cho API upload single image
 */
export const ApiUploadSingleImage = () => {
	return applyDecorators(
		ApiOperation({ summary: 'Upload single image' }),
		ApiQuery({
			name: 'folder',
			enum: UploadFolderType,
			required: false,
			description: 'Loại thư mục để lưu file (avatar, banner, product). Nếu không có, file sẽ lưu ở thư mục gốc',
			example: UploadFolderType.AVATAR,
		}),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					file: {
						type: 'string',
						format: 'binary',
						description: 'Image file (JPEG, PNG, GIF, WebP - Max 5MB)',
					},
				},
			},
		}),
		ApiResponse({
			status: 201,
			description: 'Image uploaded successfully',
			schema: {
				type: 'object',
				properties: {
					url: {
						type: 'string',
						example: '/v1/uploads/avatar/123e4567-e89b-12d3-a456-426614174000.jpg',
					},
					filename: {
						type: 'string',
						example: '123e4567-e89b-12d3-a456-426614174000.jpg',
					},
				},
			},
		}),
	);
};

