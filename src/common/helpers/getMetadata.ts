import { Request } from 'express';
import { DEFAULT_QUERY } from '../enums';

export const getMetadata = (req: Request, data: any[]) => {
    // data[1] là tổng số lượng bản ghi trả về từ Repository (count)
    const total = data[1] ? Number(data[1]) : 0; 
    
    // Lấy query từ request và ép kiểu số
    const page = req.query.page ? Number(req.query.page) : DEFAULT_QUERY.PAGE;
    const limitQuery = req.query.limit ? Number(req.query.limit) : DEFAULT_QUERY.LIMIT;

    // Giới hạn limit không vượt quá MAX_LIMIT
    const limit = limitQuery <= DEFAULT_QUERY.MAX_LIMIT ? limitQuery : DEFAULT_QUERY.MAX_LIMIT;

    // Tính tổng số trang
    const totalPage = Math.ceil(total / Number(limit));

    // Trả về object với tên biến ngắn gọn, trực quan
    return {
        page,
        limit,
        total,
        totalPage,
    };
};