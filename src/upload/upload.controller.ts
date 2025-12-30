import { ApiPost, APP_ROUTES, HTTP_STATUS_ENUM } from '@common';
import { JwtAuthGuard } from '@guards';
import {
    Controller,
    Query,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UploadImageDto } from './dto/upload-image.dto';
import { ApiUploadMultipleImages, ApiUploadSingleImage } from './swagger';
import { UploadService } from './upload.service';

// --- ADMIN CONTROLLER ---
@Controller('')
@ApiTags(APP_ROUTES.ADMIN.UPLOAD.IMAGE.tag)
export class AdminUploadController {
    constructor(private readonly uploadService: UploadService) {}

    @UseInterceptors(FileInterceptor('file'))
    @ApiPost(APP_ROUTES.ADMIN.UPLOAD.IMAGE.path, {
        summary: 'Admin upload một ảnh',
        swagger: ApiUploadSingleImage(),
        response: UploadImageDto,
        status: HTTP_STATUS_ENUM.CREATED,
    })
    @UseGuards(JwtAuthGuard)
    @ApiSecurity('access-token')
    async adminUploadSingleImage(@UploadedFile() file: Express.Multer.File, @Query() query: UploadImageDto) {
        // Tự động gán typeUpload là admin và ưu tiên folder từ query gửi lên
        return this.uploadService.uploadImage(file, { 
            ...query, 
            typeUpload: 'admin', 
            folder: query.folder || 'general' 
        });
    }

    @UseInterceptors(FilesInterceptor('files', 10))
    @ApiPost('admins/upload/multiple', {
        summary: 'Admin upload nhiều ảnh cùng lúc',
        swagger: ApiUploadMultipleImages(),
        response: UploadImageDto,
        status: HTTP_STATUS_ENUM.CREATED,
    })
    async adminUploadMultipleImages(@UploadedFiles() files: Express.Multer.File[], @Query() query: UploadImageDto) {
        return this.uploadService.uploadMultipleImages(files, { 
            ...query, 
            typeUpload: 'admin', 
            folder: query.folder || 'general' 
        });
    }
}

// --- CUSTOMER CONTROLLER ---
@Controller('')
@ApiTags(APP_ROUTES.CUSTOMER.UPLOAD.IMAGE.tag)
export class CustomerUploadController {
    constructor(private readonly uploadService: UploadService) {}

    @UseInterceptors(FileInterceptor('file'))
    @ApiPost(APP_ROUTES.CUSTOMER.UPLOAD.IMAGE.path, {
        summary: 'Customer upload một ảnh',
        swagger: ApiUploadSingleImage(),
        response: UploadImageDto,
        status: HTTP_STATUS_ENUM.CREATED,
    })
    @UseGuards(JwtAuthGuard)
    @ApiSecurity('access-token')
    async customerUploadSingleImage(@UploadedFile() file: Express.Multer.File, @Query() query: UploadImageDto) {
        return this.uploadService.uploadImage(file, { 
            ...query, 
            typeUpload: 'customer', 
            folder: query.folder || 'general' 
        });
    }
}