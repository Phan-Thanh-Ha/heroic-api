import { HTTP_STATUS_ENUM, ROUTER_ENUM, ROUTER_TAG_ENUM } from '@common';
import {
	Controller,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
	HttpCode,
	Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { LoggerService } from '@logger';
import { ApiUploadSingleImage, ApiUploadMultipleImages } from './swagger';
import { UploadImageDto } from './dto/upload-image.dto';

@Controller(ROUTER_ENUM.UPLOAD.IMAGE)
@ApiTags(ROUTER_TAG_ENUM.UPLOAD.IMAGE)
export class UploadController {
	constructor(
		private readonly uploadService: UploadService,
		private readonly loggerService: LoggerService,
	) {}
	private context = UploadController.name;

	// Upload một ảnh
	@Post('single')
	@HttpCode(HTTP_STATUS_ENUM.CREATED)
	@UseInterceptors(FileInterceptor('file'))
	@ApiUploadSingleImage()
	async uploadSingleImage(
		@UploadedFile() file: Express.Multer.File,
		@Query() query: UploadImageDto,
	) {
		this.loggerService.log(this.context, 'uploadSingleImage', {
			file: file?.originalname,
			size: file?.size,
			folder: query.folder,
			
		});
		try {
			const result = await this.uploadService.uploadImage(file, query.folder);
			return result;
		} catch (error) {
			this.loggerService.error(this.context, 'uploadSingleImage', error);
			throw error;
		}
	}

	// Upload nhiều ảnh cùng lúc
	@Post('multiple')
	@HttpCode(HTTP_STATUS_ENUM.CREATED)
	@UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
	@ApiUploadMultipleImages()
	async uploadMultipleImages(
		@UploadedFiles() files: Express.Multer.File[],
		@Query() query: UploadImageDto,
	) {
		this.loggerService.log(this.context, 'uploadMultipleImages', {
			count: files?.length,
			folder: query.folder,
		});

		try {
			const result = await this.uploadService.uploadMultipleImages(files, query.folder);
			return result;
		} catch (error) {
			this.loggerService.error(this.context, 'uploadMultipleImages', error);
			throw error;
		}
	}
}

