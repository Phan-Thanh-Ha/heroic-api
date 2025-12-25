import { SuccessType } from "src/common/interfaces";

interface WardSuccessTypes {
	FIND_WARDS_BY_DISTRICT_CODE: SuccessType;
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
	};
};