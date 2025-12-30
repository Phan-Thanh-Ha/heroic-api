import { Injectable, LoggerService, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configuration } from '@config';
import { adminAuthErrorTypes, StrategyKey } from '@common';
import { EmployeesRepository } from 'src/apis/admin/employees/employees.repository';
import { Employee } from 'src/apis/admin/employees/entities/employee.entity';
import { Customer } from 'src/apis/customer/customer/entities/customer.entity';
import { CustomerRepository } from 'src/apis/customer/customer/customer.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        // private readonly loggerService: LoggerService,
        // private readonly employeesRepository: EmployeesRepository,
        // private readonly customersRepository: CustomerRepository,
    ) {
        super({
            jwtFromRequest: (req) => {
                // 1. Thử lấy từ Header chuẩn (Authorization: Bearer ...)
                let token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

                // 2. Nếu không có, thử lấy từ thuộc tính 'token' (như trong log của bạn)
                if (!token && req.token) {
                    token = req.token.replace('Bearer ', '').trim();
                }

                // 3. Nếu vẫn không có, thử lấy từ header Authorization nhưng không có Bearer
                if (!token && req.headers.authorization) {
                    token = req.headers.authorization.replace('Bearer ', '').trim();
                }

                return token;
            },
            ignoreExpiration: false,
            secretOrKey: configuration().secretKey!,
        });
    }

    async validate(payload: any) {
        let user = null;

        // Dựa vào Key 'userType' để chọn bảng tìm kiếm
        if (payload.typeAccessToken === 'admin') {
            return { ...payload, type: 'admin' };
        } else if (payload.typeAccessToken === 'customer') {
            return { ...payload, type: 'customer' };
        }

        throw new UnauthorizedException(adminAuthErrorTypes().AUTH_TOKEN_ERROR);
    }
}