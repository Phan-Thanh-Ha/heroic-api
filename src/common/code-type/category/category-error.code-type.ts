import { ErrorType } from "../../interfaces";

interface CategoryErrorTypes {
    CATEGORY_CREATE_FAILED: ErrorType;
    CATEGORY_GET_LIST_FAILED: ErrorType;
}

export const categoryErrorTypes = (): CategoryErrorTypes => {
    return {
        CATEGORY_CREATE_FAILED: {
            error_code: 'CATEGORY_CREATE_FAILED',
            message: {
                vi: 'Tạo danh mục thất bại',
                en: 'Create category failed',
                cn: '创建分类失败',
            },
        },
        CATEGORY_GET_LIST_FAILED: {
            error_code: 'CATEGORY_GET_LIST_FAILED',
            message: {
                vi: 'Lấy danh sách danh mục thất bại',
                en: 'Get list category failed',
                cn: '获取分类列表失败',
            },
        },
    };
};