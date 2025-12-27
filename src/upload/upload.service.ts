import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
    // Khởi tạo Supabase Client
    private supabase = createClient(
        process.env.SUPABASE_URL || '',
        process.env.SUPABASE_ANON_KEY || '',
    );

    async uploadImage(file: Express.Multer.File, folder: string = 'general') {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file ảnh');
        }

        const isProduction = process.env.NODE_ENV === 'production';
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `${folder}/${fileName}`; // Cấu trúc thư mục trong bucket hoặc local

        if (!isProduction) {
            // --- CHẾ ĐỘ PRODUCTION (SUPABASE) ---
            const { data, error } = await this.supabase.storage
                .from(process.env.SUPABASE_BUCKET_NAME || '')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) throw new Error(`Supabase Error: ${error.message}`);

            const { data: { publicUrl } } = this.supabase.storage
                .from(process.env.SUPABASE_BUCKET_NAME || '')
                .getPublicUrl(filePath);

            return { url: publicUrl, name: fileName, provider: 'supabase' };
        } else {
            // --- CHẾ ĐỘ DEVELOPMENT (LOCAL STORAGE) ---
            const uploadDir = path.join(process.cwd(), 'uploads', folder);
            
            // Tạo thư mục nếu chưa có (ví dụ: uploads/employees)
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const localFilePath = path.join(uploadDir, fileName);
            fs.writeFileSync(localFilePath, file.buffer);

            // Trả về URL local (Lưu ý: Bạn cần config static trong main.ts)
            const url = `http://localhost:${process.env.PORT || 3000}/uploads/${folder}/${fileName}`;
            return { url: url, name: fileName, provider: 'local' };
        }
    }

    async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'general') {
        if (!files || files.length === 0) {
            throw new BadRequestException('Vui lòng chọn ít nhất một file');
        }

        const uploadPromises = files.map(file => this.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    }
}