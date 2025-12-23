/**
 * Tạo mã OTP gồm 6 số ngẫu nhiên
 * @returns Mã OTP 6 chữ số dạng string
 */
export const generateOTP = (): string => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	return otp;
};

