/**
 * Tạo mã đơn hàng theo cấu trúc: ORD-yyyyMMdd-0001
 * - ORD: prefix cố định
 * - yyyyMMdd: ngày hiện tại (năm 4 số, tháng 2 số, ngày 2 số)
 * - 0001: số thứ tự (dựa trên id) padding 4 chữ số
 *
 * Chỉ cần truyền id, phần ngày/tháng/năm util sẽ tự xử lý.
 */
export const generateOrderCode = (id: number, date: Date = new Date()): string => {
	const year = date.getFullYear().toString(); // yyyy
	const month = String(date.getMonth() + 1).padStart(2, '0'); // MM
	const day = String(date.getDate()).padStart(2, '0'); // dd

	const prefix = `ORD-${year}${month}${day}`; // ORD-yyyyMMdd
	const sequenceStr = String(id).padStart(4, '0'); // 0001

	return `${prefix}-${sequenceStr}`;
};
