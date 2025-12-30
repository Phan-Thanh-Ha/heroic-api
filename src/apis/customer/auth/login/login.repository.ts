import { customerAuthErrorTypes, customerAuthSuccessTypes } from "@common";
import { JwtService } from "@jwt";
import { LoggerService } from "@logger";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@prisma";
import { generateCustomerCode, generateUUID, generateOTP } from "@utils";
import bcrypt from "bcryptjs";
import { LoginFacebookDto } from "./dto/login-facebook.dto";
import { LoginGoogleDto } from "./dto/login-google.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { MailService } from "../../../../mail/mail.service";

@Injectable()
export class LoginRepository {
    private context = LoginRepository.name;
    constructor(
        private readonly prisma: PrismaService,
        private readonly loggerService: LoggerService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
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

                // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
                const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

                // Tạo mã OTP 6 số
                const otpCode = generateOTP();

                // Lưu OTP vào database
                await this.prisma.customer.update({
                    where: { id: customerResponse.id },
                    data: { otpCode },
                });

                // Tạo JWT token cho khách hàng
                const accessToken = await this.jwtService.signJwtCustomer({
                    customerId: customerResponse.id,
                    customerCode: trimmedCustomerCode,
                    fullName: customerResponse.fullName,
                    email: customerResponse.email,
                    facebookId: customerResponse.facebookId,
                    googleId: customerResponse.googleId,
                    typeAccessToken: 'customer',
                });

                return {
                    message: customerAuthSuccessTypes().AUTH_LOGIN_GOOGLE_SUCCESS.message,
                    info: {
                        ...customerResponse,
                        customerCode: trimmedCustomerCode,
                    },
                    accessToken,
                    otpCode,
                };
            }

            // Chưa tồn tại, tạo customer mới rồi đăng nhập luôn
            const newCustomer = await this.createCustomerWithGoogle(loginGoogleDto);
            
            // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
            const trimmedCustomerCode = newCustomer.customerCode?.trim() || newCustomer.customerCode;

            // Tạo mã OTP 6 số
            const otpCode = generateOTP();

            // Lưu OTP vào database
            await this.prisma.customer.update({
                where: { id: newCustomer.id },
                data: { otpCode },
            });

            const accessToken = await this.jwtService.signJwtCustomer({
                customerId: newCustomer.id,
                customerCode: trimmedCustomerCode,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                facebookId: newCustomer.facebookId,
                googleId: newCustomer.googleId,
                typeAccessToken: 'customer',
            });

            return {
                message: customerAuthSuccessTypes().AUTH_LOGIN_GOOGLE_SUCCESS.message,
                info: {
                    ...newCustomer,
                    customerCode: trimmedCustomerCode,
                },
                accessToken,
                otpCode,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'loginWithGoogle', error);
            throw error;
        }
    }
    //#endregion

    //#region Đăng nhập với Email
    async loginWithEmail(loginDto: LoginDto) {
        try {
            // Kiểm tra email đã tồn tại chưa
            const existingCustomer = await this.checkEmailExists(loginDto.email);

            if (!existingCustomer) {
                throw new BadRequestException(
                    customerAuthErrorTypes().AUTH_INCORRECT,
                );
            }

            // Nếu có password, kiểm tra password
            if (loginDto.password) {
                if (!existingCustomer.password) {
                    throw new BadRequestException(
                        customerAuthErrorTypes().NOT_HAVE_PASSWORD,
                    );
                }

                const isPasswordValid = await bcrypt.compare(
                    loginDto.password,
                    existingCustomer.password,
                );

                if (!isPasswordValid) {
                    throw new UnauthorizedException(
                        customerAuthErrorTypes().AUTH_INCORRECT,
                    );
                }
            }

            // Đăng nhập thành công
            const { password, ...customerResponse } = existingCustomer;

            // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
            const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

            // Tạo mã OTP 6 số
            const otpCode = generateOTP();

            // Lưu OTP vào database
            try {
                await this.prisma.customer.update({
                    where: { id: customerResponse.id },
                    data: { otpCode },
                });

                // Gửi email OTP sau khi lưu OTP thành công
                if (customerResponse.email) {
                    try {
                        await this.mailService.sendMailOTP({
                            email: customerResponse.email,
                            otpCode,
                        });
                    } catch (error) {
                        this.loggerService.error(this.context, 'Failed to send OTP email', error);
                        // Không throw error để không làm gián đoạn login flow
                    }
                }
            } catch (error) {
                this.loggerService.error(this.context, 'Failed to save OTP to database', error);
                // Nếu lỗi do cột otp_code chưa tồn tại, vẫn tiếp tục nhưng log warning
                // Người dùng cần chạy: npm run prisma:push để sync database
                if (error instanceof Error && error.message.includes('otp_code')) {
                    this.loggerService.log(
                        this.context,
                        'Column otp_code may not exist in database. Please run: npm run prisma:push',
                    );
                }
                // Vẫn tiếp tục với OTP đã tạo, không throw error để không làm gián đoạn login
            }

            // Không tạo token ở đây, token chỉ được cấp sau khi verify OTP thành công
            return {
                message: customerAuthSuccessTypes().AUTH_LOGIN_SUCCESS.message,
                info: {
                    ...customerResponse,
                    customerCode: trimmedCustomerCode,
                },
                otpCode, // Chỉ trả về OTP để user verify
            };
        } catch (error) {
            this.loggerService.error(this.context, 'loginWithEmail', error);
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

                // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
                const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

                // Tạo mã OTP 6 số
                const otpCode = generateOTP();

                // Lưu OTP vào database
                await this.prisma.customer.update({
                    where: { id: customerResponse.id },
                    data: { otpCode },
                });

                const accessToken = await this.jwtService.signJwtCustomer({
                    customerId: customerResponse.id,
                    customerCode: trimmedCustomerCode,
                    fullName: customerResponse.fullName,
                    email: customerResponse.email,
                    facebookId: customerResponse.facebookId,
                    googleId: customerResponse.googleId,
                    typeAccessToken: 'customer',
                });

                return {
                    message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                    info: {
                        ...customerResponse,
                        customerCode: trimmedCustomerCode,
                    },
                    accessToken,
                    otpCode,
                };
            }

            // 2. Nếu chưa có facebookId nhưng có email → liên kết vào tài khoản đã có email
            if (loginFacebookDto.email) {
                const existingByEmail = await this.checkEmailExists(
                    loginFacebookDto.email,
                );

                if (existingByEmail) {
                    // Tạo mã OTP 6 số
                    const otpCode = generateOTP();

                    const updatedCustomer = await this.prisma.customer.update({
                        where: { id: existingByEmail.id },
                        data: {
                            facebookId: loginFacebookDto.facebookId,
                            avatarUrl: loginFacebookDto.avatarUrl,
                            fullName:
                                loginFacebookDto.fullName ||
                                existingByEmail.fullName,
                            typeRegister: 'Facebook',
                            otpCode,
                        },
                    });

                    const { password, ...customerResponse } = updatedCustomer;
                    
                    // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
                    const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

                    const accessToken = await this.jwtService.signJwtCustomer({
                        customerId: customerResponse.id,
                        customerCode: trimmedCustomerCode,
                        fullName: customerResponse.fullName,
                        email: customerResponse.email,
                        facebookId: customerResponse.facebookId,
                        googleId: customerResponse.googleId,
                        typeAccessToken: 'customer',
                    });

                    return {
                        message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                        info: {
                            ...customerResponse,
                            customerCode: trimmedCustomerCode,
                        },
                        accessToken,
                        otpCode,
                    };
                }
            }

            // 3. Không tìm thấy email / facebookId → tạo khách hàng mới rồi đăng nhập luôn
            const newCustomer = await this.createCustomerWithFacebook(loginFacebookDto);
            
            // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
            const trimmedCustomerCode = newCustomer.customerCode?.trim() || newCustomer.customerCode;

            // Tạo mã OTP 6 số
            const otpCode = generateOTP();

            // Lưu OTP vào database
            await this.prisma.customer.update({
                where: { id: newCustomer.id },
                data: { otpCode },
            });

            const accessToken = await this.jwtService.signJwtCustomer({
                customerId: newCustomer.id,
                customerCode: trimmedCustomerCode,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                facebookId: newCustomer.facebookId,
                googleId: newCustomer.googleId,
                typeAccessToken: 'customer',
            });

            return {
                message: customerAuthSuccessTypes().AUTH_LOGIN_FACEBOOK_SUCCESS.message,
                info: {
                    ...newCustomer,
                    customerCode: trimmedCustomerCode,
                },
                accessToken,
                otpCode,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'loginWithFacebook', error);
            throw error;
        }
    }
    //#endregion

    //#region Xác thực OTP
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
        try {
            // Trim OTP để loại bỏ khoảng trắng thừa
            const trimmedOtpCode = verifyOtpDto.otpCode?.trim() || verifyOtpDto.otpCode;

            // Query trực tiếp trong database với điều kiện email và otpCode
            // Database sẽ tự động so sánh otpCode, không cần so sánh trong code
            const existingCustomer = await this.prisma.customer.findFirst({
                where: {
                    email: verifyOtpDto.email,
                    otpCode: trimmedOtpCode, // Query với điều kiện otpCode chính xác
                },
            });

            // Nếu không tìm thấy, kiểm tra xem email có tồn tại không để phân biệt lỗi
            if (!existingCustomer) {
                // Kiểm tra email có tồn tại không
                const emailExists = await this.checkEmailExists(verifyOtpDto.email);
                if (!emailExists) {
                    throw new BadRequestException(
                        customerAuthErrorTypes().AUTH_INCORRECT,
                    );
                }

                // Email tồn tại nhưng OTP không khớp hoặc không có OTP
                const customerWithOtp = await this.prisma.customer.findUnique({
                    where: { email: verifyOtpDto.email },
                    select: { otpCode: true },
                });

                if (!customerWithOtp?.otpCode) {
                    throw new BadRequestException(
                        customerAuthErrorTypes().OTP_NOT_FOUND,
                    );
                }

                // OTP không đúng
                throw new BadRequestException(
                    customerAuthErrorTypes().OTP_INCORRECT,
                );
            }

            // OTP đúng, xóa OTP khỏi database để không thể sử dụng lại
            await this.prisma.customer.update({
                where: { id: existingCustomer.id },
                data: { otpCode: null },
            });

            const { password, ...customerResponse } = existingCustomer;

            // Trim customerCode để loại bỏ khoảng trắng thừa từ Char(50)
            const trimmedCustomerCode = customerResponse.customerCode?.trim() || customerResponse.customerCode;

            // Tạo JWT token cho khách hàng sau khi verify OTP thành công
            const accessToken = await this.jwtService.signJwtCustomer({
                customerId: customerResponse.id,
                customerCode: trimmedCustomerCode,
                fullName: customerResponse.fullName,
                email: customerResponse.email,
                facebookId: customerResponse.facebookId,
                googleId: customerResponse.googleId,
                typeAccessToken: 'customer',
            });

            return {
                message: customerAuthSuccessTypes().AUTH_VERIFY_OTP_SUCCESS.message,
                info: {
                    ...customerResponse,
                    customerCode: trimmedCustomerCode,
                },
                accessToken,
            };
        } catch (error) {
            this.loggerService.error(this.context, 'verifyOtp', error);
            throw error;
        }
    }
    //#endregion

}