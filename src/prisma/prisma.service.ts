import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private pool: Pool;

    constructor() {
        // Ưu tiên lấy DATABASE_URL từ môi trường (Render/Supabase)
        // Nếu không có thì mới dùng mặc định cho Docker Local
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new Error(
                'DATABASE_URL is missing. Please set it in your .env file.',
            );
        }

        // Log đường dẫn để debug (ẩn mật khẩu để bảo mật)
        const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
        console.log('🔗 Connecting to database:', maskedUrl);

        // Tạo PostgreSQL adapter với connection pool
        const pool = new Pool({
            connectionString: databaseUrl,
        });
        
        const adapter = new PrismaPg(pool);

        // Khởi tạo PrismaClient với adapter
        super({ adapter } as Prisma.PrismaClientOptions);
        
        this.pool = pool;
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Prisma connected successfully.');
        } catch (error) {
            console.error('❌ Prisma connection error:', error);
            console.error('💡 Hint: Check if your Docker container or Supabase instance is running.');
            throw error;
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            if (this.pool) {
                await this.pool.end();
            }
            console.log('🔌 Prisma disconnected.');
        } catch (error) {
            console.error('❌ Error disconnecting Prisma:', error);
        }
    }
}