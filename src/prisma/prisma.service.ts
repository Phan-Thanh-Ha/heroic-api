import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import type { PoolConfig } from 'mariadb';
import { configuration } from '../config';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

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

        console.log('🔗 Connecting to database:', `${user}@${host}:${port}/${database}`);

        // Tạo PoolConfig với cấu hình từ environment variables
        const poolConfig: PoolConfig = {
            host,
            port,
            user,
            password,
            database,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
            acquireTimeout: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '60000', 10), // 60 seconds
            idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '300000', 10), // 5 minutes
            minimumIdle: parseInt(process.env.DB_MINIMUM_IDLE || '2', 10),
            allowPublicKeyRetrieval: process.env.DB_ALLOW_PUBLIC_KEY_RETRIEVAL !== 'false', // Default: true
        };

        // Tạo adapter với PoolConfig
        const adapter = new PrismaMariaDb(poolConfig, {
            onConnectionError: (err) => {
                console.error('❌ Database connection error (Adapter):', err);
            },
        });

        // Gọi super() và truyền adapter vào
        super({ adapter });
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
            console.log('🔌 Prisma disconnected from database.');
        } catch (error) {
            console.error('❌ Error disconnecting Prisma:', error);
        }
    }
}