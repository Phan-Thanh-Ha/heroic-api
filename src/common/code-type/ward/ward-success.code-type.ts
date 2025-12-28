import { SuccessType } from "src/common/interfaces";

interface WardSuccessTypes {
	FIND_WARDS_BY_DISTRICT_CODE: SuccessType;
	FIND_WARDS_BY_WARD_ID: SuccessType;
}

export const wardSuccessTypes = function (): WardSuccessTypes {
	return {
		FIND_WARDS_BY_DISTRICT_CODE: {
			success_code: 'WARD_FIND_WARDS_BY_DISTRICT_CODE_SUCCESS',
			message: {
				vi: 'Lấy danh sách xã/phường thành công',
				en: 'Get wards by district code successfully',
				cn: '获取街道成功',
			},
		},
		FIND_WARDS_BY_WARD_ID: {
			success_code: 'WARD_FIND_WARDS_BY_WARD_ID_SUCCESS',
			message: {
				vi: 'Lấy thông tin xã/phường thành công',
				en: 'Get ward by ward id successfully',
				cn: '获取街道成功',
			},
		},
	};
};