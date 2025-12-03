/**
 * @fileoverview Hàm tiện ích tạo Schema phản hồi lỗi cho OpenAPI.
 */

// ====================================================================
//                          I. CONSTANTS & MAPPINGS
// ====================================================================

// Ánh xạ các tên phản hồi lỗi thông dụng với Status Code tương ứng
const ERROR_STATUS_MAP = {
    ApiUnauthorizedResponse: 401,
    ApiForbiddenResponse: 403,
    ApiNotFoundResponse: 404,
    ApiConflictResponse: 409, // Thêm 409
    ApiInternalServerError: 500, // Thêm 500
    // Default/fallback sẽ là 400 (Bad Request)
};


// ====================================================================
//                          II. UTILS TẠO VÍ DỤ
// ====================================================================

/**
 * Tạo một example (ví dụ) cho phản hồi lỗi API.
 * @param {object} example - Thông tin lỗi cụ thể (error_name, error_code, message).
 * @param {number} status - Mã trạng thái HTTP.
 * @returns {object} Cấu trúc example đã được định dạng.
 */
const createErrorExample = (example, status) => ({
    [example.error_name]: {
        value: {
            status: status,
            data: {
                error_code: example.error_code,
                message: example.message,
            },
        },
    },
});

/**
 * Chuyển đổi mảng ví dụ lỗi thành cấu trúc đối tượng cần thiết cho OpenAPI.
 * @param {Array<object>} examples - Danh sách các ví dụ lỗi.
 * @param {number} status - Mã trạng thái HTTP chung cho các ví dụ này.
 * @returns {object} Cấu trúc Examples.
 */
const buildErrorExamples = (examples, status) => {
    return examples.reduce((list, e) => ({
        ...list,
        ...createErrorExample(e, status),
    }), {});
};


// ====================================================================
//                          III. HÀM CHÍNH (MAIN EXPORT FUNCTION)
// ====================================================================

/**
 * Hàm chính tạo cấu trúc Schema phản hồi lỗi (4xx/5xx) cho OpenAPI.
 *
 * @param {object} data - Dữ liệu cấu hình cho Schema.
 * @param {string} data.description - Mô tả cho phản hồi lỗi.
 * @param {string} data.title - Tên mô hình của phản hồi lỗi (ví dụ: ApiUnauthorizedResponse).
 * @param {Array<object>} data.examples - Danh sách các ví dụ lỗi.
 * @param {number} [data.customStatus] - (Tùy chọn) Ghi đè Status Code nếu cần.
 * @returns {object} Cấu trúc Schema phản hồi lỗi đầy đủ.
 */
export const APIFailSchema = (data) => {
    // Ưu tiên customStatus, sau đó là ánh xạ theo title, mặc định là 400
    const statusCode = data.customStatus || ERROR_STATUS_MAP[data.title] || 400;

    // Định nghĩa Schema cho phần 'data'
    const defaultFailDataSchema = {
        title: 'DefaultFailResponse',
        type: 'object',
        properties: {
            error_code: { type: 'string', description: 'Mã lỗi nội bộ (ví dụ: AUTH_001).' },
            message: { type: 'string', description: 'Thông báo lỗi chi tiết.' },
        },
    };

    const fullSchema = {
        title: data.title,
        type: 'object',
        properties: {
            status: { type: 'number', default: statusCode },
            data: defaultFailDataSchema,
        },
    };

    return {
        description: data.description,
        content: {
            'application/json': {
                schema: fullSchema,
                // Sử dụng hàm tiện ích để xây dựng examples
                examples: buildErrorExamples(data.examples, statusCode),
            },
        },
    };
};