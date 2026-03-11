import { Module } from '@nestjs/common';
import { SocketAdminModule } from './admin';
import { SocketCustomerModule } from './customer';
import { PrismaModule } from '../prisma';
import { JwtModule } from 'src/jwt';

@Module({
    imports: [
        JwtModule,
        PrismaModule,
        SocketCustomerModule,
        SocketAdminModule,
    ],
})
export class SocketModule { }