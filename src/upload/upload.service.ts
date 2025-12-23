import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { UploadFolderType } from './dto/upload-image.dto';

@Injectable()
export class UploadService {
	/**
	 * Đường dẫn lưu trữ file upload
	 * Ưu tiên: UPLOAD_PATH từ env → ./uploads (thư mục mặc định)
	 */
	private readonly uploadPath: string = (() => {
		// Ưu tiên 1: UPLOAD_PATH từ environment variable
		if (process.env.UPLOAD_PATH) {
			return process.env.UPLOAD_PATH;
		}
		// Ưu tiên 2: ./uploads trong project (thư mục mặc định)
		return path.join(process.cwd(), 'uploads');
	})();

	constructor() {
		// Tự động tạo thư mục uploads và các thư mục con khi service khởi tạo
		this.ensureUploadDirectoryExists();
		// Tạo các thư mục con (avatar, banner, product) ngay từ đầu
		this.initializeSubFolders();
	}

	/**
	 * Khởi tạo các thư mục con (avatar, banner, product) ngay từ đầu
	 */
	private initializeSubFolders(): void {
		Object.values(UploadFolderType).forEach((folder) => {
			this.ensureFolderExists(folder);
		});
	}
	

	/**
	 * Đảm bảo thư mục uploads tồn tại, nếu chưa có thì tạo mới
	 */
	private ensureUploadDirectoryExists(): void {
		if (!fs.existsSync(this.uploadPath)) {
			try {
				fs.mkdirSync(this.uploadPath, { recursive: true });
				console.log(`✅ Created upload directory: ${this.uploadPath}`);
			} catch (error) {
				console.error(`❌ Failed to create upload directory: ${this.uploadPath}`, error);
				throw new Error(`Cannot create upload directory: ${error.message}`);
			}
		}
	}

	/**
	 * Đảm bảo thư mục con (theo folder type) tồn tại
	 * @param folder Loại thư mục từ enum (avatar, banner, product)
	 * @returns Đường dẫn đầy đủ đến thư mục con
	 */
	private ensureFolderExists(folder?: UploadFolderType): string {
		// Đảm bảo thư mục gốc tồn tại
		this.ensureUploadDirectoryExists();

		// Nếu không có folder, trả về thư mục gốc
		if (!folder) {
			return this.uploadPath;
		}

		// Tạo đường dẫn thư mục con
		const folderPath = path.join(this.uploadPath, folder);

		// Tạo thư mục con nếu chưa tồn tại
		if (!fs.existsSync(folderPath)) {
			try {
				fs.mkdirSync(folderPath, { recursive: true });
				console.log(`✅ Created folder: ${folderPath}`);
			} catch (error) {
				console.error(`❌ Failed to create folder: ${folderPath}`, error);
				throw new BadRequestException(`Cannot create folder: ${error.message}`);
			}
		}

		return folderPath;
	}

	/**
	 * Upload image và trả về URL
	 * @param file File cần upload
	 * @param folder Loại thư mục từ enum (avatar, banner, product)
	 */
	async uploadImage(
		file: Express.Multer.File,
		folder?: UploadFolderType,
	): Promise<{ url: string; filename: string }> {
		if (!file) {
			throw new BadRequestException('No file uploaded');
		}

		// Validate file type
		const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
		if (!allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
			);
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			throw new BadRequestException('File size exceeds 5MB limit');
		}

		// Đảm bảo thư mục (gốc hoặc con) tồn tại
		const targetFolderPath = this.ensureFolderExists(folder);
		const targetFolderName = folder || '';

		// Tạo tên file unique
		const fileExtension = path.extname(file.originalname);
		const uniqueFilename = `${uuidv4()}${fileExtension}`;
		const filePath = path.join(targetFolderPath, uniqueFilename);

		// Lưu file
		try {
			fs.writeFileSync(filePath, file.buffer);
		} catch (error) {
			throw new BadRequestException(`Failed to save file: ${error.message}`);
		}

		// Trả về URL để client có thể truy cập
		// Nếu có folder, URL sẽ bao gồm folder: /v1/uploads/avatar/filename.jpg
		const url = targetFolderName
			? `/v1/uploads/${targetFolderName}/${uniqueFilename}`
			: `/v1/uploads/${uniqueFilename}`;

		return {
			url,
			filename: uniqueFilename,
		};
	}

	/**
	 * Upload multiple images
	 * @param files Danh sách files cần upload
	 * @param folder Loại thư mục từ enum (avatar, banner, product)
	 */
	async uploadMultipleImages(
		files: Express.Multer.File[],
		folder?: UploadFolderType,
	): Promise<{ urls: string[]; filenames: string[] }> {
		if (!files || files.length === 0) {
			throw new BadRequestException('No files uploaded');
		}

		const results = await Promise.all(files.map((file) => this.uploadImage(file, folder)));

		return {
			urls: results.map((r) => r.url),
			filenames: results.map((r) => r.filename),
		};
	}
}

