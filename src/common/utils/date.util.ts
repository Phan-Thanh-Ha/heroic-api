// date.utils.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 🚨 Kích hoạt plugin (GIỮ NGUYÊN)
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Chuyển đổi chuỗi ngày tháng (DD-MM-YYYY) thành đối tượng Date chuẩn UTC (Date("1995-07-17T00:00:00.000Z")).
 */
export function convertDdMmYyyyToUTCDate(dateString: string): Date | null {
    if (!dateString) {
        return null;
    }
    
    const dateObject = dayjs(dateString, 'DD-MM-YYYY', true).utc(true); 

    if (!dateObject.isValid()) {
        console.error(`Ngày tháng không hợp lệ: ${dateString}`);
        return null;
    }

    return dateObject.toDate();
}

/**
 * Date("1995-07-17T00:00:00.000Z") -> Unix timestamp (806083200) by timeZone
 *
 * - Nếu KHÔNG truyền timeZone → trả về Unix theo UTC (mặc định).
 * - Nếu CÓ truyền timeZone (VD: "Asia/Ho_Chi_Minh") → convert theo múi giờ đó.
 */
export function toUnixByTimeZone(
    date: Date | string | null | undefined,
    timeZone?: string | null,
): number | null {
    if (!date) return null;
    const d = dayjs(date);
    if (!d.isValid()) return null;

    // Nếu có timezone thì ép về múi giờ đó, không thì lấy UTC chuẩn
    const unix = timeZone ? d.tz(timeZone).unix() : d.unix();
    return unix;
}

/**
 *
 *
 * @param value - Date object, string parse được thành Date, hoặc null/undefined
 * @returns Chuỗi định dạng yyyy-MM-dd hoặc null nếu không hợp lệ
 *
 */
export function formatDateToYMD(value: Date | string | null | undefined): string | null {
    if (!value) return null;
    const d = dayjs(value);
    return d.isValid() ? d.format('YYYY-MM-DD') : null;
}

