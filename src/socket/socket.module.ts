import { Module } from '@nestjs/common';
import { SocketAdminModule } from './admin';
import { SocketCustomerModule } from './customer';
import { PrismaModule } from '../prisma';
import { JwtModule } from '../jwt/index';

@Module({
    imports: [
        JwtModule,
        PrismaModule,
        SocketCustomerModule,
        SocketAdminModule,
    ],
})
export class SocketModule { }