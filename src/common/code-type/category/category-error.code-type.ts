import { ErrorType } from "../../interfaces";

interface CategoryErrorTypes {
    CATEGORY_CREATE_FAILED: ErrorType;
    CATEGORY_GET_LIST_FAILED: ErrorType;

    CATEGORY_UPDATE_FAILED: ErrorType;
    CATEGORY_DELETE_FAILED: ErrorType;
    CATEGORY_TOGGLE_FAILED: ErrorType;
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
        CATEGORY_UPDATE_FAILED: {
            error_code: 'CATEGORY_UPDATE_FAILED',
            message: {
                vi: 'Cập nhật danh mục thất bại',
                en: 'Update category failed',
                cn: '更新分类失败',
            },
        },
        CATEGORY_DELETE_FAILED: {
            error_code: 'CATEGORY_DELETE_FAILED',
            message: {
                vi: 'Xóa danh mục thất bại',
                en: 'Delete category failed',
                cn: '删除分类失败',
            },
        },
        CATEGORY_TOGGLE_FAILED: {
            error_code: 'CATEGORY_TOGGLE_FAILED',
            message: {
                vi: 'Mở/Đóng danh mục thất bại',
                en: 'Toggle category failed',
                cn: '打开/关闭分类失败',
            },
        },
    };
};