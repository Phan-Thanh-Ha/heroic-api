import { ErrorType } from "@common";

interface OrderErrorCodeType {
    ORDER_CREATE_FAILED: ErrorType;
    ORDER_NOT_FOUND: ErrorType;
    ORDER_STATUS_INVALID: ErrorType;
    ORDER_PAYMENT_STATUS_INVALID: ErrorType;
}


export const orderErrorCodeType = (): OrderErrorCodeType => {
    return {
        ORDER_CREATE_FAILED: {
            error_code: 'ORDER_CREATE_FAILED',
            message: {
                vi: 'Tạo đơn hàng thất bại',
                en: 'Failed to create order',
                cn: '创建订单失败',
            },
        },
        ORDER_NOT_FOUND: {
            error_code: 'ORDER_NOT_FOUND',
            message: {
                vi: 'Đơn hàng không tồn tại',
                en: 'Order not found',
                cn: '订单不存在',
            },
        },
        ORDER_STATUS_INVALID: {
            error_code: 'ORDER_STATUS_INVALID',
            message: {
                vi: 'Trạng thái đơn hàng không hợp lệ',
                en: 'Invalid order status',
                cn: '订单状态无效',
            },
        },
        ORDER_PAYMENT_STATUS_INVALID: {
            error_code: 'ORDER_PAYMENT_STATUS_INVALID',
            message: {
                vi: 'Trạng thái thanh toán đơn hàng không hợp lệ',
                en: 'Invalid payment status',
                cn: '订单支付状态无效',
            },
        },
    }
}