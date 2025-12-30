import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { UploadFolderType } from '../dto/upload-image.dto';

/**
 * Swagger decorator cho API upload multiple images
 */
export const ApiUploadMultipleImages = () => {
	return applyDecorators(
		ApiOperation({ 
			summary: 'Upload multiple images',
			description: 'Upload nhiều ảnh cùng lúc (tối đa 10 files). Field name trong form-data PHẢI là "files" (không phải "file" hay tên khác).',
		}),
		ApiQuery({
			name: 'folder',
			enum: UploadFolderType,
			required: false,
			description: 'Loại thư mục để lưu file (avatar, banner, product). Nếu không có, file sẽ lưu ở thư mục gốc',
			example: UploadFolderType.PRODUCT,
		}),
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				required: ['files'],
				properties: {
					files: {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary',
						},
						description: 'Image files (JPEG, PNG, GIF, WebP - Max 5MB each). Field name PHẢI là "files" (không phải "file" hay tên khác).',
					},
				},
			},
		}),
		ApiHeader({
			name: 'token',
			required: true,
			schema: { type: 'string'},
		}),
		ApiResponse({
			status: 201,
			description: 'Images uploaded successfully',
			schema: {
				type: 'object',
				properties: {
					urls: {
						type: 'array',
						items: { type: 'string' },
						example: [
							'/v1/uploads/product/123e4567-e89b-12d3-a456-426614174000.jpg',
							'/v1/uploads/product/123e4567-e89b-12d3-a456-426614174001.png',
						],
					},
					filenames: {
						type: 'array',
						items: { type: 'string' },
						example: [
							'123e4567-e89b-12d3-a456-426614174000.jpg',
							'123e4567-e89b-12d3-a456-426614174001.png',
						],
					},
				},
			},
		}),
	);
};

