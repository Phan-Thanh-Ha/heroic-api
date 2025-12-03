import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PRISMA MODULE - MODULE KẾT NỐI DATABASE
 * 
 * 🌐 GLOBAL MODULE: Có thể sử dụng ở bất kỳ đâu trong ứng dụng
 * 🔗 DATABASE: Cung cấp PrismaService cho toàn bộ ứng dụng
 * 📊 PRISMA CLIENT: Tự động inject PrismaService
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
