import { ErrorType } from '@common';

interface CustomerAuthErrorTypes {
	AUTH_LOGIN_FAILED: ErrorType;
	AUTH_INCORRECT: ErrorType;
	AUTH_EXPIRED: ErrorType;
	AUTH_TOKEN_ERROR: ErrorType;
	AUTH_TOKEN_INACTIVE: ErrorType;
	AUTH_NOMATCH: ErrorType;
	AUTH_REFRESH_TOKEN_EXPIRED: ErrorType;
	MISSING_HEADER: ErrorType;
	NO_PERMISSION: ErrorType;
	OLD_PASSWORD_INCORRECT: ErrorType;
	USER_TYPE_INCORRECT: ErrorType;
	USER_IS_BLOCKED: ErrorType;
	USER_NOT_VERIFIED: ErrorType;
	REMEMBER_ACCOUNT_IS_EXPIRED: ErrorType;
	NOT_HAVE_PASSWORD: ErrorType;
	INCORRECT_PASSWORD_TOO_MANY_TIMES: ErrorType;
	PASSWORD_TIMES: ErrorType;
	OTP_INCORRECT: ErrorType;
	OTP_NOT_FOUND: ErrorType;
	OTP_EXPIRED: ErrorType;
}

export const customerAuthErrorTypes = function (_id?: string,): CustomerAuthErrorTypes {
	return {
		AUTH_LOGIN_FAILED: {
			error_code: 'AUTH_LOGIN_FAILED',
			message: {
				vi: 'Đăng nhập thất bại',
				en: 'Login failed',
				cn: '登录失败',
			},
		},
		AUTH_INCORRECT: {
			error_code: 'AUTH_INCORRECT',
			message: {
				vi: 'Tên người dùng hoặc mật khẩu không khớp',
				en: 'Username or password does not match',
				cn: '用户名或密码不匹配',
			},
		},
		AUTH_EXPIRED: {
			error_code: 'AUTH_EXPIRED',
			message: {
				vi: 'Đăng nhập hết hạn',
				en: 'Login expired',
				cn: '登录已过期',
			},
		},
		AUTH_TOKEN_ERROR: {
			error_code: 'AUTH_TOKEN_ERROR',
			message: {
				vi: 'Token bị lỗi',
				en: 'Token got error',
				cn: '令牌有错误',
			},
		},
		AUTH_TOKEN_INACTIVE: {
			error_code: 'AUTH_TOKEN_INACTIVE',
			message: {
				vi: 'Token không hoạt động',
				en: 'Token inactive',
				cn: '令牌不活跃',
			},
		},
		AUTH_NOMATCH: {
			error_code: 'AUTH_NOTMATCH',
			message: {
				vi: 'Người dùng không phù hợp',
				en: 'The user does not match',
				cn: '用户不匹配',
			},
		},
		AUTH_REFRESH_TOKEN_EXPIRED: {
			error_code: 'AUTH_REFRESH_TOKEN_EXPIRED',
			message: {
				vi: 'Refresh token đã hết hạn',
				en: 'Refresh token expired',
				cn: '刷新令牌已过期',
			},
		},
		MISSING_HEADER: {
			error_code: 'MISSING_HEADER',
			message: {
				vi: 'Thiếu token',
				en: 'Missing headers',
				cn: '缺乏代币',
			},
		},
		NO_PERMISSION: {
			error_code: 'NO_PERMISSION',
			message: {
				vi: 'Bạn không có quyền truy cập',
				en: "You don't have permission to access",
				cn: '您无权访问',
			},
		},
		OLD_PASSWORD_INCORRECT: {
			error_code: 'OLD_PASSWORD_INCORRECT',
			message: {
				vi: 'Mật khẩu cũ không đúng',
				en: 'Old password is incorrect',
				cn: '旧密码不正确',
			},
		},
		USER_TYPE_INCORRECT: {
			error_code: 'USER_TYPE_INCORRECT',
			message: {
				vi: 'Chức năng này không dành cho tài khoản của bạn',
				en: 'User type is incorrect',
				cn: '用户类型不正确',
			},
		},
		USER_IS_BLOCKED: {
			error_code: 'USER_IS_BLOCKED',
			message: {
				vi: 'Tài khoản đã bị khóa',
				en: 'User is blocked!',
				cn: '账户已被锁定',
			},
		},
		USER_NOT_VERIFIED: {
			error_code: 'USER_NOT_VERIFIED',
			message: {
				vi: 'Tài khoản chưa được xác thực',
				en: 'User did not verify!',
				cn: '已验证帐户',
			},
		},
		REMEMBER_ACCOUNT_IS_EXPIRED: {
			error_code: 'REMEMBER_ACCOUNT_IS_EXPIRED',
			message: {
				vi: 'Việc ghi nhớ tài khoản đã hết hạn, xin mới đăng nhập lại!',
				en: 'Remember account is expired, please login again!',
				cn: '记住账号已过期，请重新登录',
			},
		},
		NOT_HAVE_PASSWORD: {
			error_code: 'NOT_HAVE_PASSWORD',
			message: {
				vi: 'Không nhập mật khẩu!',
				en: 'Not have password!',
				cn: '没有密码',
			},
		},
		INCORRECT_PASSWORD_TOO_MANY_TIMES: {
			error_code: 'INCORRECT_PASSWORD_TOO_MANY_TIMES',
			message: {
				vi: 'Bạn nhập sai mật khẩu quá nhiều lần, tài khoản của bạn đã bị khóa, vui lòng liên hệ admin để mở lại!',
				en: 'Your pass is incorect too many times, your account is blocked, please contact admin to active it again!',
				cn: '您的通行证错误次数过多，您的帐户已被锁定，请联系管理员重新激活它',
			},
		},
		PASSWORD_TIMES: {
			error_code: 'PASSWORD_TIMES',
			message: {
				vi: `Số lần nhập còn lại ${_id}`,
				en: `Remaining number of entries ${_id}`,
				cn: `剩余条目数 ${_id}`,
			},
		},
		OTP_INCORRECT: {
			error_code: 'OTP_INCORRECT',
			message: {
				vi: 'Mã OTP không đúng',
				en: 'OTP code is incorrect',
				cn: 'OTP代码不正确',
			},
		},
		OTP_NOT_FOUND: {
			error_code: 'OTP_NOT_FOUND',
			message: {
				vi: 'Không tìm thấy mã OTP. Vui lòng đăng nhập lại để nhận mã OTP mới',
				en: 'OTP code not found. Please login again to receive a new OTP code',
				cn: '未找到OTP代码。请重新登录以接收新的OTP代码',
			},
		},
		OTP_EXPIRED: {
			error_code: 'OTP_EXPIRED',
			message: {
				vi: 'Mã OTP đã hết hạn. Vui lòng đăng nhập lại để nhận mã OTP mới',
				en: 'OTP code has expired. Please login again to receive a new OTP code',
				cn: 'OTP代码已过期。请重新登录以接收新的OTP代码',
			},
		},
	};
};


