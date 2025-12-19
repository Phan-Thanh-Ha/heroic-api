import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { configuration } from '../config';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private pool: Pool;

    constructor() {
        const config = configuration();
        
        // Lấy thông tin kết nối trực tiếp từ config (đã xử lý từ env)
        const host = config.dbHost;
        const port = config.dbPort;
        const user = config.dbUserName;
        const password = config.dbPassWord;
        const database = config.dbName;

        // Kiểm tra thông tin bắt buộc
        if (!host || !user || !database) {
            throw new Error(
                'Database connection information is missing. Please set DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME in your .env file.',
            );
        }

        // Tạo DATABASE_URL từ các biến môi trường nếu chưa có
        const databaseUrl = process.env.DATABASE_URL || `postgresql://${user}:${password}@${host}:${port}/${database}`;
        
        // Set DATABASE_URL environment variable
        process.env.DATABASE_URL = databaseUrl;

        console.log('🔗 Connecting to PostgreSQL database:', `${user}@${host}:${port}/${database}`);

        // Với Prisma 7.x, BẮT BUỘC phải cung cấp adapter hoặc accelerateUrl
        // Tạo PostgreSQL adapter với connection pool
        // Phải tạo pool trước khi gọi super()
        const pool = new Pool({
            connectionString: databaseUrl,
        });
        const adapter = new PrismaPg(pool);

        // Khởi tạo PrismaClient với adapter
        super({ adapter } as Prisma.PrismaClientOptions);
        
        // Gán pool vào this sau khi super() đã được gọi
        this.pool = pool;
    }

    /**
     * KHỞI TẠO KẾT NỐI DATABASE
     * - Tự động gọi khi module khởi tạo.
     * - Kết nối đến database.
     */
    async onModuleInit() {
        try {
            // Sử dụng $connect() để kiểm tra kết nối khi module khởi tạo
            await this.$connect();
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
        try {
            await this.$disconnect();
            // Đóng connection pool
            if (this.pool) {
                await this.pool.end();
            }
            console.log('🔌 Prisma disconnected from database.');
        } catch (error) {
            console.error('❌ Error disconnecting Prisma:', error);
        }
    }
}