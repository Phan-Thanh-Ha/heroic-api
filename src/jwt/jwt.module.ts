import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config'; 

@Global()
@Module({
    imports: [
        ConfigModule, 
        NestJwtModule.register({}),
    ],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}