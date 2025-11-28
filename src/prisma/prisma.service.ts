import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { configuration } from '../config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor(private configService: ConfigService) {
		const config = configuration();
		const databaseUrl = config.databaseUrl || process.env.DATABASE_URL;
		
		// Set DATABASE_URL vào process.env nếu chưa có
		if (databaseUrl && !process.env.DATABASE_URL) {
			process.env.DATABASE_URL = databaseUrl;
		}
		
		super();
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
	}
}

