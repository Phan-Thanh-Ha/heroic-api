import { SuccessType } from "src/common/interfaces";

interface CustomerSuccessTypes {
    GET_CUSTOMER_LIST: SuccessType;
    UPDATE_CUSTOMER: SuccessType;
}
export const customerSuccessTypes = function (): CustomerSuccessTypes {
    return {
        GET_CUSTOMER_LIST: {
            success_code: 'CUSTOMER_GET_CUSTOMER_LIST_SUCCESS',
            message: {
                vi: 'Lấy danh sách khách hàng',
                en: 'Get customer list successfully',
                cn: '在所有省市取得成功。',
            },
        },

        UPDATE_CUSTOMER: {
            success_code: 'CUSTOMER_UPDATE_SUCCESS',
            message: {
                vi: 'Cập nhật thông tin khách hàng thành công',
                en: 'Update customer successfully',
                cn: '更新客户成功', // (Bạn có thể sửa lại tiếng Trung nếu cần)
            }
        }
    };
}; 