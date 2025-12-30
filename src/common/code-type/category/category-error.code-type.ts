import { ErrorType } from "../../interfaces";

interface CategoryErrorTypes {
    CATEGORY_CREATE_FAILED: ErrorType;
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
    };
};