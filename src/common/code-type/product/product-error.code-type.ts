import { ErrorType } from "../../interfaces";

interface ProductErrorTypes {
    PRODUCT_CREATE_FAILED: ErrorType;

    PRODUCT_GET_LIST_FAILED: ErrorType;
}


export const productErrorTypes = (): ProductErrorTypes => {
    return {
        PRODUCT_CREATE_FAILED: {
            error_code: 'PRODUCT_CREATE_FAILED',
            message: {
                vi: 'Tạo sản phẩm thất bại',
                en: 'Create product failed',
                cn: '创建产品失败',
            },
        },
        PRODUCT_GET_LIST_FAILED: {
            error_code: 'PRODUCT_GET_LIST_FAILED',
            message: {
                vi: 'Lấy danh sách sản phẩm thất bại',
                en: 'Get list product failed',
                cn: '获取产品列表失败',
            },
        },
    };
};