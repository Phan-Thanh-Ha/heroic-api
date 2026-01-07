import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private pool: Pool;

    constructor() {
        const databaseUrl = process.env.DATABASE_URL;

        // Nếu có URL, khởi tạo adapter ngay
        if (databaseUrl) {
            const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
            console.log('🔗 Database URL detected:', maskedUrl);

            const pool = new Pool({ connectionString: databaseUrl });
            const adapter = new PrismaPg(pool);
            
            super({ adapter } as Prisma.PrismaClientOptions);
            this.pool = pool;
        } else {
            // Nếu chưa có, khởi tạo Prisma mặc định (sẽ báo lỗi ở onModuleInit sau)
            console.warn('⚠️ DATABASE_URL not found in constructor, waiting for module init...');
            super();
        }
    }

    async onModuleInit() {
        if (!process.env.DATABASE_URL) {
            console.error('❌ FATAL ERROR: DATABASE_URL is missing from environment variables!');
            throw new Error('DATABASE_URL is missing');
        }

        try {
            await this.$connect();
            console.log('✅ Prisma connected successfully.');
        } catch (error) {
            console.error('❌ Prisma connection error:', error);
            throw error;
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
        if (this.pool) {
            await this.pool.end();
        }
    }
}