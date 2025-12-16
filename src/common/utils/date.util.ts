import { BadRequestException } from '@nestjs/common';

/**
 * Parse chuỗi ngày sinh thành Date.
 * Hỗ trợ các định dạng:
 * - dd/MM/yyyy
 * - dd-MM-yyyy
 */
export const parseBirthdayToDate = (birthday: string): Date => {

	const [dayStr, monthStr, yearStr] = birthday.split(/[/\-]/);

	const day = Number(dayStr);
	const month = Number(monthStr);
	const year = Number(yearStr);

	if (!day || !month || !year) {
		throw new BadRequestException('Không hợp lệ, định dạng phải dd/MM/yyyy hoặc dd-MM-yyyy');
	}

	// Dùng UTC để tránh lệch ngày do timezone (VD: +7 bị lùi 1 ngày)
	const date = new Date(Date.UTC(year, month - 1, day));

	if (isNaN(date.getTime())) {
		throw new BadRequestException('Không hợp lệ, định dạng phải dd/MM/yyyy hoặc dd-MM-yyyy');
	}

	return date;
};

/**
 * Format Date (hoặc string parse được thành Date) về dạng yyyy-MM-dd
 * Dùng cho các field ngày sinh / ngày không cần time.
 */
export const formatDateToYMD = (value: Date | string | null | undefined): string | null => {
	if (!value) return null;

	const date = value instanceof Date ? value : new Date(value);
	if (isNaN(date.getTime())) {
		return null;
	}

	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};


