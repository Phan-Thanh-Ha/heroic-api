import { ErrorType } from '../../../interfaces';

interface AdminAuthErrorTypes {
	AUTH_LOGIN_FAILED: ErrorType;
	AUTH_INCORRECT: ErrorType;
	AUTH_EXPIRED: ErrorType;
	AUTH_TOKEN_ERROR: ErrorType;
	AUTH_TOKEN_INACTIVE: ErrorType;
	NO_PERMISSION: ErrorType;
	USER_IS_BLOCKED: ErrorType;
}

export const adminAuthErrorTypes = function (): AdminAuthErrorTypes {
	return {
		AUTH_LOGIN_FAILED: {
			error_code: 'ADMIN_AUTH_LOGIN_FAILED',
			message: {
				vi: 'Đăng nhập admin thất bại',
				en: 'Admin login failed',
				cn: '管理员登录失败',
			},
		},
		AUTH_INCORRECT: {
			error_code: 'ADMIN_AUTH_INCORRECT',
			message: {
				vi: 'Tài khoản hoặc mật khẩu admin không đúng',
				en: 'Admin username or password is incorrect',
				cn: '管理员用户名或密码不正确',
			},
		},
		AUTH_EXPIRED: {
			error_code: 'ADMIN_AUTH_EXPIRED',
			message: {
				vi: 'Phiên đăng nhập admin đã hết hạn',
				en: 'Admin session expired',
				cn: '管理员登录已过期',
			},
		},
		AUTH_TOKEN_ERROR: {
			error_code: 'ADMIN_AUTH_TOKEN_ERROR',
			message: {
				vi: 'Token admin bị lỗi',
				en: 'Admin token got error',
				cn: '管理员令牌有错误',
			},
		},
		AUTH_TOKEN_INACTIVE: {
			error_code: 'ADMIN_AUTH_TOKEN_INACTIVE',
			message: {
				vi: 'Token admin không hoạt động',
				en: 'Admin token inactive',
				cn: '管理员令牌不活跃',
			},
		},
		NO_PERMISSION: {
			error_code: 'ADMIN_NO_PERMISSION',
			message: {
				vi: 'Bạn không có quyền truy cập chức năng admin này',
				en: 'You do not have permission for this admin feature',
				cn: '您无权访问此管理员功能',
			},
		},
		USER_IS_BLOCKED: {
			error_code: 'ADMIN_USER_IS_BLOCKED',
			message: {
				vi: 'Tài khoản admin đã bị khóa',
				en: 'Admin user is blocked',
				cn: '管理员账号已被锁定',
			},
		},
	};
};


