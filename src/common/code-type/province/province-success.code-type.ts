import { SuccessType } from '@common';

interface ProvinceSuccessTypes {
	GET_ALL_PROVINCE: SuccessType;
}
export const provinceSuccessTypes = function (): ProvinceSuccessTypes {
	return {
		GET_ALL_PROVINCE: {
			success_code: 'PROVINCE_GET_ALL_PROVINCE_SUCCESS',
			message: {
				vi: 'Lấy tất cả tỉnh thành thành công',
				en: 'Get all provinces successfully',
				cn: '获取所有省份成功',
			},
		},
	};
};