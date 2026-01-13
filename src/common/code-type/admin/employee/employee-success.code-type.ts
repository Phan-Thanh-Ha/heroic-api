import { SuccessType } from '@common';

interface AdminEmployeeSuccessTypes {
	ADMIN_EMPLOYEE_GET_LIST_SUCCESS: SuccessType;
	ADMIN_EMPLOYEE_CREATE_SUCCESS: SuccessType;
}

export const adminEmployeeSuccessTypes = function (): AdminEmployeeSuccessTypes {
	return {
		ADMIN_EMPLOYEE_GET_LIST_SUCCESS: {
			success_code: 'ADMIN_EMPLOYEE_GET_LIST_SUCCESS',
			message: {
				vi: 'Lấy danh sách nhân viên thành công',
				en: 'Get list employees successfully',
				cn: '获取员工列表成功',
			},
		},
		ADMIN_EMPLOYEE_CREATE_SUCCESS: {
			success_code: 'ADMIN_EMPLOYEE_CREATE_SUCCESS',
			message: {
				vi: 'Tạo nhân viên thành công',
				en: 'Create employee successfully',
				cn: '创建员工成功',
			},
		},
	};
};