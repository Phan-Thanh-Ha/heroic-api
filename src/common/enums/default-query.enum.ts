export enum DEFAULT_QUERY {
    PAGE = '1',
    LIMIT = '10',
    MAX_LIMIT = '100', // Giữ nguyên là string nếu bạn dùng trong Query
    MAX_LIMIT_NUMBER = 100, // Thêm giá trị number để dùng trong logic
    SORT_TYPE = 'DESC',// DESC: Giảm dần, ASC: Tăng dần
    SORT_BY = 'created_at',// Tên trường sắp xếp

}