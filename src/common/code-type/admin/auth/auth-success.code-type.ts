import { SuccessType } from '../../../interfaces';

interface AdminAuthSuccessTypes {
	AUTH_LOGIN_SUCCESS: SuccessType;
	AUTH_REGISTER_SUCCESS: SuccessType;
}

export const adminAuthSuccessTypes = function (): AdminAuthSuccessTypes {
	return {
		AUTH_LOGIN_SUCCESS: {
			success_code: 'ADMIN_AUTH_LOGIN_SUCCESS',
			message: {
				vi: 'Đăng nhập admin thành công',
				en: 'Admin login successfully',
				cn: '管理员登录成功',
			},
		},
		AUTH_REGISTER_SUCCESS: {
			success_code: 'ADMIN_AUTH_REGISTER_SUCCESS',
			message: {
				vi: 'Tạo tài khoản nhân viên thành công',
				en: 'Create staff account successfully',
				cn: '创建员工账号成功',
			},
		},
	};
};


