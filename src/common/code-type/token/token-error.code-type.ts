import { ErrorType } from "src/common/interfaces";

interface TokenErrorTypes {
    TOKEN_VERIFY_FAILED: ErrorType;
    TOKEN_EXPIRED: ErrorType;
    TOKEN_INACTIVE: ErrorType;
    TOKEN_ERROR: ErrorType;
    TOKEN_NOT_FOUND: ErrorType;
    TOKEN_NOT_VALID: ErrorType;
    TOKEN_MISSING: ErrorType;
}

export const tokenErrorTypes = function (): TokenErrorTypes {
    return {
        TOKEN_VERIFY_FAILED: {
            error_code: 'TOKEN_VERIFY_ERROR',
            message: {
                vi: 'Xác thực token thất bại',
                en: 'Token verification failed',
                cn: '验证token失败',
            },
        },
        TOKEN_EXPIRED: {
            error_code: 'TOKEN_EXPIRED',
            message: {
                vi: 'Token đã hết hạn',
                en: 'Token expired',
                cn: '令牌已过期',
            },
        },
        TOKEN_INACTIVE: {
            error_code: 'TOKEN_INACTIVE',
            message: {
                vi: 'Token không hoạt động',
                en: 'Token inactive',
                cn: '令牌不活跃',
            },
        },
        TOKEN_ERROR: {
            error_code: 'TOKEN_ERROR',
            message: {
                vi: 'Token bị lỗi',
                en: 'Token got error',
                cn: '令牌有错误',
            },
        },
        TOKEN_NOT_FOUND: {
            error_code: 'TOKEN_NOT_FOUND',
            message: {
                vi: 'Token không tồn tại',
                en: 'Token not found',
                cn: '令牌不存在',
            },
        },
        TOKEN_NOT_VALID: {
            error_code: 'TOKEN_NOT_VALID',
            message: {
                vi: 'Token không hợp lệ',
                en: 'Token not valid',
                cn: '令牌不合法',
            },
        },
        // Đã bổ sung phần bị thiếu
        TOKEN_MISSING: {
            error_code: 'TOKEN_MISSING',
            message: {
                vi: 'Thiếu token',
                en: 'Token is missing',
                cn: '缺少令牌',
            },
        },
    };
};