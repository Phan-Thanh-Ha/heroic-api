import { Request } from 'express';
import { DEFAULT_QUERY } from '../enums'; // Giả sử enum của bạn chứa các giá trị như trên

// Giả định rằng bạn có một giá trị số cho MAX_LIMIT
const MAX_LIMIT_NUMBER = +DEFAULT_QUERY.MAX_LIMIT; // Ép kiểu một lần

export const getMetadata = (req: Request, data: any[]) => {
    const { page: pageQuery, limit: limitQuery } = req.query;

    // --- 1. Xử lý Page ---
    // Lấy giá trị từ query, nếu không có hoặc không phải số hợp lệ thì dùng mặc định 1
    const page = Math.max(
        1, // Đảm bảo trang luôn >= 1
        parseInt(pageQuery as string, 10) || +DEFAULT_QUERY.PAGE 
    );
    
    // --- 2. Xử lý Limit ---
    // Lấy giá trị từ query
    let parsedLimit = parseInt(limitQuery as string, 10);
    
    // Nếu limit không hợp lệ (NaN/0) thì dùng mặc định
    if (!parsedLimit || parsedLimit <= 0) {
        parsedLimit = +DEFAULT_QUERY.LIMIT;
    }

    // Giới hạn giá trị Limit (Guard against MAX_LIMIT)
    const limit = Math.min(parsedLimit, MAX_LIMIT_NUMBER); 

    // --- 3. Tính toán Metadata ---
    const total_items = data[1];
    
    // Tính tổng số trang (Sử dụng Math.ceil để làm tròn lên)
    const total_page = Math.ceil(total_items / limit);

    return {
        page,
        limit,
        total_items,
        total_page,
    };
};