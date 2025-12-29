import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { adminAuthErrorTypes, customerAuthErrorTypes, tokenLifeTime } from '@common';
import { configuration } from '@config';
import { JwtPayloadAdmin, JwtPayloadCustomer } from './jwt.interface';

@Injectable()
export class JwtService extends NestJwtService {
    private secretKey = process.env.SECRET_KEY;
    //#region Customer
    signJwtCustomer(payload: JwtPayloadCustomer, isRefreshToken = false): string {
        const { accessTokenCustomer, refreshToken } = tokenLifeTime;
        const expiresIn = isRefreshToken ? refreshToken : accessTokenCustomer;

        return this.sign(payload, {
            expiresIn: expiresIn as any,
            secret: this.secretKey,
        });
    }

    async verifyJwtCustomer(token: string): Promise<JwtPayloadCustomer> {
        try {
            return await this.verifyAsync<JwtPayloadCustomer>(token, {
                secret: this.secretKey,
            });
        } catch (error) {
            throw new UnauthorizedException(customerAuthErrorTypes().AUTH_TOKEN_ERROR);
        }
    }
    //#endregion

    //#region Admin
    signJwtAdmin(payload: JwtPayloadAdmin, isRefreshToken = false): string {
        const { accessTokenAdmin, refreshToken } = tokenLifeTime;
        const expiresIn = isRefreshToken ? refreshToken : accessTokenAdmin;
        return this.sign(payload, {
            expiresIn: expiresIn as any,
            secret: this.secretKey,
        });
    }

    async verifyJwtAdmin(token: string): Promise<JwtPayloadAdmin> {
        try {
            return await this.verifyAsync<JwtPayloadAdmin>(token, {
                secret: this.secretKey,
            });
        } catch (error) {
            throw new UnauthorizedException(adminAuthErrorTypes().AUTH_TOKEN_ERROR);
        }
    }
    //#endregion
}