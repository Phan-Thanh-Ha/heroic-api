import { DefaultQueryDto } from '../dto'; // (Đường dẫn DTO của bạn)
import { DEFAULT_QUERY } from '../enums'; // (Đường dẫn ENUM của bạn)

export const paginationToQuery = (query: DefaultQueryDto) => {
    // Ép kiểu Number() để sửa lỗi TS2362/TS2363
    const page = query.page ? Number(query.page) : DEFAULT_QUERY.PAGE;
    
    // Xử lý limit: ép kiểu số và kiểm tra max limit
    let limitInput = query.limit ? Number(query.limit) : DEFAULT_QUERY.LIMIT;
    if (limitInput > DEFAULT_QUERY.MAX_LIMIT) {
        limitInput = DEFAULT_QUERY.MAX_LIMIT;
    }
    const limit = limitInput;

    return {
        skip: (Number(page) - 1) * Number(limit),
        take: limit,
    };
};