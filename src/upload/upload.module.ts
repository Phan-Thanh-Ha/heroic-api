import { Module } from '@nestjs/common';
import { LoggerModule } from '@logger';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
	imports: [LoggerModule],
	controllers: [UploadController],
	providers: [UploadService],
	exports: [UploadService],
})
export class UploadModule {}

