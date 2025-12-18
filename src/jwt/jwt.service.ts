import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { customerAuthErrorTypes, tokenLifeTime } from '@common';
import { configuration } from '@config';
import { JwtPayloadCustomer } from './jwt.interface';

@Injectable()
export class JwtService extends NestJwtService {
	signJwtCustomer(payload: JwtPayloadCustomer, isRefreshToken = false) {
		const { accessToken, refreshToken } = tokenLifeTime;
		const expiresIn = isRefreshToken ? refreshToken : accessToken;

		const token = this.sign<JwtPayloadCustomer>(payload, {
			expiresIn: expiresIn as any,
			secret: configuration().secretKey,
		});

		return token;
	}

	async verifyJwt(token: string) {
		try {
			const payload = await this.verify<JwtPayloadCustomer>(token, {
				secret: configuration().secretKey,
			});

			return payload;
		} catch (error) {
			throw new UnauthorizedException(customerAuthErrorTypes().AUTH_TOKEN_ERROR);
		}
	}
}
