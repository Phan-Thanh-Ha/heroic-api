import { adminAuthErrorTypes } from '@common';
import { configuration } from '@config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        // private readonly loggerService: LoggerService,
        // private readonly employeesRepository: EmployeesRepository,
        // private readonly customersRepository: CustomerRepository,
    ) {
        super({
            jwtFromRequest: (req) => {
                // lấy token từ header
                let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

                //Nếu vẫn không có, lấy từ header accessToken nhưng không có Bearer
                if (!token && req.accessToken) {
                    token = req.accessToken.replace('Bearer ', '').trim();
                }

                return token;
            },
            ignoreExpiration: false,
            secretOrKey: configuration().secretKey!,
        });
    }

    async validate(payload: any) {
        console.log('====> payload JWT Strategy validate: <====', payload);

        // Dựa vào Key 'userType' để chọn bảng tìm kiếm
        if (payload.typeAccessToken === 'admin') {
            return { ...payload, type: 'admin' };
        } else if (payload.typeAccessToken === 'customer') {
            return { ...payload, type: 'customer' };
        }

        throw new UnauthorizedException(adminAuthErrorTypes().AUTH_TOKEN_ERROR);
    }
}