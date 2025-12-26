import { SuccessType } from "src/common/interfaces";

interface CustomerSuccessTypes {
    GET_CUSTOMER_LIST: SuccessType;
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
    };
};