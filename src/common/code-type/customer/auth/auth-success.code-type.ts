import { SuccessType } from '../../../interfaces';

interface CustomerAuthSuccessTypes {
	AUTH_LOGIN_SUCCESS: SuccessType;
	AUTH_REGISTER_SUCCESS: SuccessType;
	AUTH_LOGIN_GOOGLE_SUCCESS: SuccessType;
	AUTH_LOGIN_FACEBOOK_SUCCESS: SuccessType;
	AUTH_VERIFY_OTP_SUCCESS: SuccessType;
}

export const customerAuthSuccessTypes = function (): CustomerAuthSuccessTypes {
	return {
		AUTH_LOGIN_SUCCESS: {
			success_code: 'AUTH_LOGIN_SUCCESS',
			message: {
				vi: 'Đăng nhập thành công',	
				en: 'Login successfully',
				cn: '登录成功',
			},
		},
		AUTH_REGISTER_SUCCESS: {
			success_code: 'AUTH_REGISTER_SUCCESS',
			message: {
				vi: 'Đăng ký thành công',
				en: 'Register successfully',
				cn: '注册成功',
			},
		},
		AUTH_LOGIN_GOOGLE_SUCCESS: {
			success_code: 'AUTH_LOGIN_GOOGLE_SUCCESS',
			message: {
				vi: 'Đăng nhập với Google thành công',
				en: 'Login with Google successfully',
				cn: '使用谷歌登录成功',
			},
		},
		AUTH_LOGIN_FACEBOOK_SUCCESS: {
			success_code: 'AUTH_LOGIN_FACEBOOK_SUCCESS',
			message: {
				vi: 'Đăng nhập với Facebook thành công',
				en: 'Login with Facebook successfully',
				cn: '使用脸书登录成功',
			},
		},
		AUTH_VERIFY_OTP_SUCCESS: {
			success_code: 'AUTH_VERIFY_OTP_SUCCESS',
			message: {
				vi: 'Xác thực OTP thành công',
				en: 'OTP verification successful',
				cn: 'OTP验证成功',
			},
		},
	};
};


