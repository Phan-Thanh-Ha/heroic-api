import { SuccessType } from "../../interfaces";

interface CategorySuccessTypes {
    CATEGORY_CREATE_SUCCESS: SuccessType;
    CATEGORY_GET_LIST_SUCCESS: SuccessType;
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
        CATEGORY_GET_LIST_SUCCESS: {
            success_code: 'CATEGORY_GET_LIST_SUCCESS',
            message: {
                vi: 'Lấy danh sách danh mục thành công',
                en: 'Get list category successfully',
                cn: '获取分类列表成功',
            },
        },
    };
};