import { Module } from '@nestjs/common';
import { SocketAdminModule } from './admin';
import { SocketCustomerModule } from './customer';
import { JwtModule } from '@jwt';
import { PrismaModule } from '@prisma';

@Module({
    imports: [
        JwtModule,
        PrismaModule,
        SocketCustomerModule,
        SocketAdminModule,
    ],
})
export class SocketModule {}