import { Global, Module } from '@nestjs/common';
import { PassportModule as NestPassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
    // Chỉ chứa các Module khác
    imports: [
        NestPassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    // Chứa các Strategy (vì chúng là Injectable)
    providers: [
        JwtStrategy, 
    ],
    // Xuất ra để các Module khác sử dụng
    exports: [
        NestPassportModule,
        JwtStrategy,
    ],
})
export class PassportModule {}