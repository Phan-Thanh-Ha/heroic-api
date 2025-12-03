import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
    // Tùy chọn: Thêm cấu hình logging và adapter cho Prisma 7 (engine "client").
    constructor() {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new Error('DATABASE_URL is required but not set. Please add it to your .env.development or .env file.');
        }

        const adapter = new PrismaMariaDb(databaseUrl);

        super({adapter});
    }

    /**
     * KHỞI TẠO KẾT NỐI DATABASE
     * - Tự động gọi khi module khởi tạo.
     * - Kết nối đến database.
     */
    async onModuleInit() {
        try {
            await (this as any).$connect();
            console.log('✅ Prisma connected successfully.');
        } catch (error) {
            console.error('❌ Prisma connection error:', error);
            
            throw error; 
        }
    }

    /**
     * NGẮT KẾT NỐI DATABASE
     * - Tự động gọi khi module destroy.
     * - Đóng kết nối database an toàn.
     */
    async onModuleDestroy() {
        if ((this as any).$disconnect) { 
            await (this as any).$disconnect();
            console.log('🔌 Prisma disconnected from database.');
        }
    }
}