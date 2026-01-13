import { SuccessType } from '@common';

interface TokenSuccessTypes {
    TOKEN_VERIFY_SUCCESS: SuccessType;
}

export const tokenSuccessTypes = function (): TokenSuccessTypes {
    return {
        TOKEN_VERIFY_SUCCESS: {
            success_code: 'TOKEN_VERIFY_SUCCESS',
            message: {
                vi: 'Xác thực token thành công',
                en: 'Token verification successful',
                cn: '验证token成功',
            },
        },
    };
};