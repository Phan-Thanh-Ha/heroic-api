import { SuccessType } from '@common';

interface DistrictsSuccessTypes {
	FINK_DISTRICTS_BY_PARENT_CODE: SuccessType;
}

export const districtsSuccessTypes = function (): DistrictsSuccessTypes {
	return {
		FINK_DISTRICTS_BY_PARENT_CODE: {
			success_code: 'DISTRICTS_FIND_DISTRICTS_BY_PARENT_CODE_SUCCESS',
			message: {
				vi: 'Lấy danh sách quận/huyện thành công',
				en: 'Get districts by parent code successfully',
				cn: '获取父级代码的地区成功',
			},
		},
	};
};