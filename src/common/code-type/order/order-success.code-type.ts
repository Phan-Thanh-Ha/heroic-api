import { SuccessType } from '@common';


interface OrderSuccessCodeType {
    ORDER_CREATED: SuccessType;
}

export const orderSuccessCodeType = (): OrderSuccessCodeType => {
    return {
        ORDER_CREATED: {
            success_code: 'ORDER_CREATED',
            message: {
                vi: 'Đơn hàng đã được tạo thành công',
                en: 'Order created successfully',
                cn: '订单已成功创建',
            }
        }
    }
}