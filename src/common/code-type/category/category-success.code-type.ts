import { SuccessType } from "../../interfaces";

interface CategorySuccessTypes {
    CATEGORY_CREATE_SUCCESS: SuccessType;
}

export const categorySuccessTypes = (): CategorySuccessTypes => {
    return {
        CATEGORY_CREATE_SUCCESS: {
            success_code: 'CATEGORY_CREATE_SUCCESS',
            message: {
                vi: 'Tạo danh mục thành công',
                en: 'Create category successfully',
                cn: '创建分类成功',
            },
        },
    };
};