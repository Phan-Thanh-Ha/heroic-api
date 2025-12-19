import { LoggerService } from "@logger";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { LoginGoogleDto } from "./dto/login-google.dto";
import { formatDateToYMD, generateCustomerCode, generateUUID, toUnixByTimeZone } from "@utils";
import { LoginFacebookDto } from "./dto/login-facebook.dto";
import { JwtService } from "@jwt";
import { customerAuthSuccessTypes } from "@common";

@Injectable()
export class LoginRepository {
    private context = LoginRepository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService,
        private readonly jwtService: JwtService,
    ) { }

    //#region Kiểm tra email đã tồn tại chưa
    private async checkEmailExists(email: string) {
        try {
            const customerEmail = await this.prisma.customer.findUnique({
                where: {
                    email: email,
                },
            });
            return customerEmail;
        } catch (error) {
            this.loggerService.error(this.context, 'checkEmailExists', error);
            throw error;
        }
    }
    //#endregion

    //#region Kiểm tra googleId đã tồn tại chưa
    private async checkGoogleIdExists(googleId: string) {
        try {
            const customerGoogleId = await this.prisma.customer.findFirst({
                where: { googleId },
            });
            return customerGoogleId;
        } catch (error) {
            this.loggerService.error(this.context, 'checkGoogleIdExists', error);
            throw error;
        }
    }
    //#endregion

    //#region Kiểm tra facebookId đã tồn tại chưa
    private async checkFacebookIdExists(facebookId: string) {
        try {
            const customerFacebookId = await this.prisma.customer.findFirst({
                where: { facebookId },
            });
            return customerFacebookId;
        }
        catch (error) {
            this.loggerService.error(this.context, 'checkFacebookIdExists', error);
            throw error;
        }
    }
    //#endregion

    //#region Tạo mới khách hàng + Mã (đăng ký qua Google)
    private async createCustomerWithGoogle(loginGoogleDto: LoginGoogleDto) {
        try {
            const customer = await this.prisma.$transaction(async (tx) => {
                const createdCustomer = await tx.customer.create({
                    data: {
                        uuid: generateUUID(),
                        customerCode: '',
                        firstName: loginGoogleDto.firstName,
                        lastName: loginGoogleDto.lastName,
                        fullName: loginGoogleDto.fullName,
                        avatarUrl: loginGoogleDto.avatarUrl,
                        email: loginGoogleDto.email,
                        typeRegister: 'Google',
                        googleId: loginGoogleDto.googleId,
                    },
                });

                const customerCode = generateCustomerCode(createdCustomer.id);

                const updatedCustomer = await tx.customer.update({
                    where: { id: createdCustomer.id },
                    data: { customerCode },
                });

                return {
                    ...updatedCustomer,
                };
            });

            const { password, ...rest } = customer as any;
            const dataResponse = {
                ...rest
            };

            return dataResponse;
        } catch (error) {
            this.loggerService.error(this.context, 'createCustomerWithGoogle', error);
            throw error;
        }
    }
    //#endregion

    //#region Tạo mới khách hàng + Mã (đăng ký qua Facebook)
    private async createCustomerWithFacebook(loginFacebookDto: LoginFacebookDto) {
        try {
            const customer = await this.prisma.customer.create({
                data: {
                    uuid: generateUUID(),
                    customerCode: '',
                    fullName: loginFacebookDto.fullName,
                    avatarUrl: loginFacebookDto.avatarUrl,
                    email: loginFacebookDto.email ?? '',
                    typeRegister: 'Facebook',
                    facebookId: loginFacebookDto.facebookId,
                },
            });

            const customerCode = generateCustomerCode(customer.id);

            const updatedCustomer = await this.prisma.customer.update({
                where: { id: customer.id },
                data: { customerCode },
            });

            return updatedCustomer;
        } catch (error) {
            this.loggerService.error(this.context, 'createCustomerWithFacebook', error);
            throw error;
        }
    }
    //#endregion

    //#region Đăng nhập với Google
    async loginWithGoogle(loginGoogleDto: LoginGoogleDto) {
        try {
            // Kiểm tra googleId đã tồn tại chưa
            const existingGoogleId = await this.checkGoogleIdExists(loginGoogleDto.googleId);

            if (existingGoogleId) {
                // Đăng nhập thành công với customer hiện có
                const { password, ...customerResponse } = existingGoogleId;

                // Tạo JWT token cho khách hàng
                const accessToken = await this.jwtService.signJwtCustomer({
                    customerId: customerResponse.id,
                    customerCode: customerResponse.customerCode,
                    fullName: customerResponse.fullName,
                    email: customerResponse.email,
                    facebookId: customerResponse.facebookId,
                    googleId: customerResponse.googleId,
                });

                return {
                    message: customerAuthSuccessTypes().AUTH_LOGIN_GOOGLE_SUCCESS.message,
                    info: {
                        ...customerResponse,
                    },
                    accessToken,
                };
            }

            // Chưa tồn tại, tạo customer mới rồi đăng nhập luôn
            const newCustomer = await this.createCustomerWithGoogle(loginGoogleDto);
            const accessToken = await this.jwtService.signJwtCustomer({
                customerId: newCustomer.id,
                customerCode: newCustomer.customerCode,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                facebookId: newCustomer.facebookId,
                googleId: newCustomer.googleId,
            });

            return {
                message: customerAuthSuccessTypes().AUTH_LOGIN_GOOGLE_SUCCESS.message,
                info: {
                    ...newCustomer,
                },
                accessToken,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'loginWithGoogle', error);
            throw error;
        }
    }
    //#endregion

    //#region Đăng nhập với Facebook
    async loginWithFacebook(loginFacebookDto: LoginFacebookDto) {
        try {
            // 1. Kiểm tra theo facebookId (đã từng login FB trước đó)
            const existingByFacebook = await this.checkFacebookIdExists(
                loginFacebookDto.facebookId,
            );

            // Nếu đã tồn tại facebookId → đăng nhập thành công
            if (existingByFacebook) {
                const { password, ...customerResponse } = existingByFacebook;

                const accessToken = await this.jwtService.signJwtCustomer({
                    customerId: customerResponse.id,
                    customerCode: customerResponse.customerCode,
                    fullName: customerResponse.fullName,
                    email: customerResponse.email,
                    facebookId: customerResponse.facebookId,
                    googleId: customerResponse.googleId,
                });

                return {
                    message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                    info: {
                        ...customerResponse,
                    },
                    accessToken,
                };
            }

            // 2. Nếu chưa có facebookId nhưng có email → liên kết vào tài khoản đã có email
            if (loginFacebookDto.email) {
                const existingByEmail = await this.checkEmailExists(
                    loginFacebookDto.email,
                );

                if (existingByEmail) {
                    const updatedCustomer = await this.prisma.customer.update({
                        where: { id: existingByEmail.id },
                        data: {
                            facebookId: loginFacebookDto.facebookId,
                            avatarUrl: loginFacebookDto.avatarUrl,
                            fullName:
                                loginFacebookDto.fullName ||
                                existingByEmail.fullName,
                            typeRegister: 'Facebook',
                        },
                    });

                    const { password, ...customerResponse } = updatedCustomer;
                    const accessToken = await this.jwtService.signJwtCustomer({
                        customerId: customerResponse.id,
                        customerCode: customerResponse.customerCode,
                        fullName: customerResponse.fullName,
                        email: customerResponse.email,
                        facebookId: customerResponse.facebookId,
                        googleId: customerResponse.googleId,
                    });

                    return {
                        message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                        info: {
                            ...customerResponse,
                        },
                        accessToken,
                    };
                }
            }

            // 3. Không tìm thấy email / facebookId → tạo khách hàng mới rồi đăng nhập luôn
            const newCustomer = await this.createCustomerWithFacebook(loginFacebookDto);
            const accessToken = await this.jwtService.signJwtCustomer({
                customerId: newCustomer.id,
                customerCode: newCustomer.customerCode,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                facebookId: newCustomer.facebookId,
                googleId: newCustomer.googleId,
            });

            return {
                message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                info: {
                    ...newCustomer,
                },
                accessToken,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'loginWithFacebook', error);
            throw error;
        }
    }
    //#endregion
}