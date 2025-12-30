import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
// Import cả 2 Controller mới tách
import { AdminUploadController, CustomerUploadController } from './upload.controller'; 
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LoggerModule } from '@logger'; // <--- 1. IMPORT LOGGER MODULE

@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
        }),
        LoggerModule,
    ],
    controllers: [AdminUploadController, CustomerUploadController], 
    providers: [UploadService],
    exports: [UploadService],
})
export class UploadModule {}