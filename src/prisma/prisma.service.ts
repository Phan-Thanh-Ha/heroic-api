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
            const missing: string[] = [];
            if (!host) missing.push('DB_HOST');
            if (!user) missing.push('DB_USERNAME');
            if (!database) missing.push('DB_NAME');
            throw new Error(
                `Database connection information is missing. Missing: ${missing.join(', ')}. Please set these in your .env.development file.`,
            );
        }

        // Tạo DATABASE_URL từ các biến môi trường nếu chưa có
        const databaseUrl = process.env.DATABASE_URL || `postgresql://${user}:${password ? '***' : '(no password)'}@${host}:${port}/${database}`;
        
        // Set DATABASE_URL environment variable (với password thực)
        const actualDatabaseUrl = process.env.DATABASE_URL || `postgresql://${user}:${password}@${host}:${port}/${database}`;
        process.env.DATABASE_URL = actualDatabaseUrl;

        console.log('🔗 Connecting to PostgreSQL database:', `${user}@${host}:${port}/${database}`);
        console.log('   Connection string:', databaseUrl);

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
            console.error('💡 Kiểm tra:');
            console.error('   1. Docker Desktop đã chạy chưa?');
            console.error('   2. PostgreSQL container đã khởi động chưa? (docker ps | grep heroic-postgres)');
            console.error('   3. DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME trong .env.development có đúng không?');
            console.error('   4. Chạy: bash scripts/start-docker-and-postgres.sh');
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