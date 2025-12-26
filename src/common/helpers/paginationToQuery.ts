import { DefaultQueryDto } from '../dto'; // (Đường dẫn DTO của bạn)
import { DEFAULT_QUERY } from '../enums'; // (Đường dẫn ENUM của bạn)

export const paginationToQuery = (query: DefaultQueryDto) => {
    const page = query.page ? Number(query.page) : DEFAULT_QUERY.PAGE;
    
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