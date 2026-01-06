import { SuccessType } from "@interfaces";

interface ProductSuccessCode {
    PRODUCT_CREATE_SUCCESS: SuccessType;
    PRODUCT_GET_LIST_SUCCESS: SuccessType;
}

export const productSuccessCode = (): ProductSuccessCode => {
    return {
        PRODUCT_CREATE_SUCCESS: {
            success_code: 'PRODUCT_CREATE_SUCCESS',
            message: {
                vi: 'Tạo sản phẩm thành công',
                en: 'Create product successfully',
                cn: '创建产品成功',
            },
        },
        PRODUCT_GET_LIST_SUCCESS: {
            success_code: 'PRODUCT_GET_LIST_SUCCESS',
            message: {
                vi: 'Lấy danh sách sản phẩm thành công',
                en: 'Get list product successfully',
                cn: '获取产品列表成功',
            },
        },
    };
};