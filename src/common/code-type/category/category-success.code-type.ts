import { SuccessType } from "../../interfaces";

interface CategorySuccessTypes {
    CATEGORY_CREATE_SUCCESS: SuccessType;
    CATEGORY_GET_LIST_SUCCESS: SuccessType;
    CATEGORY_UPDATE_SUCCESS: SuccessType;
    CATEGORY_DELETE_SUCCESS: SuccessType;
    CATEGORY_TOGGLE_SUCCESS: SuccessType;
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
        CATEGORY_UPDATE_SUCCESS: {
            success_code: 'CATEGORY_UPDATE_SUCCESS',
            message: {
                vi: 'Cập nhật danh mục thành công',
                en: 'Update category successfully',
                cn: '更新分类成功',
            },
        },
        CATEGORY_DELETE_SUCCESS: {
            success_code: 'CATEGORY_DELETE_SUCCESS',
            message: {
                vi: 'Xóa danh mục thành công',
                en: 'Delete category successfully',
                cn: '删除分类成功',
            },
        },
        CATEGORY_TOGGLE_SUCCESS: {
            success_code: 'CATEGORY_TOGGLE_SUCCESS',
            message: {
                vi: 'Mở/Đóng danh mục thành công',
                en: 'Open/Close category successfully',
                cn: '打开/关闭分类成功',
            },
        },
    };
};