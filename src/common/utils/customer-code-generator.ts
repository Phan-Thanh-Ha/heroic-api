/**
 * Tạo mã khách hàng theo cấu trúc: KHyyMMdd0001
 * - KH: prefix cố định
 * - yyMMdd: ngày hiện tại (năm 2 số, tháng 2 số, ngày 2 số)
 * - 0001: số thứ tự (dựa trên id) padding 4 chữ số
 *
 * Chỉ cần truyền id, phần ngày/tháng/năm util sẽ tự xử lý.
 */
export const generateCustomerCode = (id: number, date: Date = new Date()): string => {
	const year = date.getFullYear().toString().slice(-2); // yy
	const month = String(date.getMonth() + 1).padStart(2, '0'); // MM
	const day = String(date.getDate()).padStart(2, '0'); // dd

	const prefix = `KH${year}${month}${day}`; // KHyyMMdd
	const sequenceStr = String(id).padStart(4, '0'); // 0001

	return `${prefix}${sequenceStr}`;
};