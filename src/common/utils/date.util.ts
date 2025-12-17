// date.utils.ts
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

// 🚨 Kích hoạt plugin (GIỮ NGUYÊN)
dayjs.extend(customParseFormat);
dayjs.extend(utc);

/**
 * Chuyển đổi chuỗi ngày tháng (DD-MM-YYYY) thành đối tượng Date chuẩn UTC.
 * * Sử dụng .utc(true) để phân tích chuỗi như là thời gian UTC 
 * (đảm bảo ngày 17-07-1995 không bị lùi thành 16-07 khi chuyển sang UTC).
 */
export function convertDdMmYyyyToUTCDate(dateString: string): Date | null {
    if (!dateString) {
        return null;
    }
    
    // 1. Phân tích chuỗi với định dạng rõ ràng 'DD-MM-YYYY' VÀ coi nó là UTC (dùng .utc(true))
    const dateObject = dayjs(dateString, 'DD-MM-YYYY', true).utc(true); 
    // Tham số thứ 3 là strict mode (true), đảm bảo việc phân tích chính xác.
    // .utc(true) là tham số cho phép phân tích chuỗi như là UTC.

    if (!dateObject.isValid()) {
        console.error(`Ngày tháng không hợp lệ: ${dateString}`);
        return null;
    }

    // 2. Trả về đối tượng Date
    // Kết quả sẽ là 1995-07-17T00:00:00.000Z
    return dateObject.toDate();
}

/**
 * Chuyển Date thành Unix timestamp (seconds) theo múi giờ IANA từ header,
 * ví dụ: 'Asia/Ho_Chi_Minh', 'America/New_York', ...
 *
 * - date: Date hoặc string parse được thành Date (giá trị UTC lưu trong DB).
 * - timeZone: múi giờ client truyền lên (IANA time zone từ header).
 *
 * Kết quả: Unix timestamp tính theo thời điểm LOCAL của múi giờ đó.
 */
export function toUnixByTimeZone(
    date: Date | string | null | undefined,
    timeZone?: string | null,
): number | null {
    if (!date) return null;

    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return null;

    // Nếu không có timeZone -> trả về Unix UTC chuẩn
    if (!timeZone) {
        return Math.floor(d.getTime() / 1000);
    }

    // Lấy thời điểm local của timeZone tương ứng với cùng "instant" UTC
    const formatterOptions: Intl.DateTimeFormatOptions = {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    // Chuỗi local theo timeZone và theo UTC
    const localeStringInTZ = d.toLocaleString('en-US', formatterOptions);
    const localeStringInUTC = d.toLocaleString('en-US', { ...formatterOptions, timeZone: 'UTC' });

    // Parse lại thành Date để lấy chênh lệch mili-giây giữa timeZone và UTC
    const localInTZ = new Date(localeStringInTZ);
    const localInUTC = new Date(localeStringInUTC);

    if (isNaN(localInTZ.getTime()) || isNaN(localInUTC.getTime())) {
        return Math.floor(d.getTime() / 1000);
    }

    const offsetMs = localInTZ.getTime() - localInUTC.getTime();
    const unixSeconds = Math.floor((d.getTime() + offsetMs) / 1000);

    return unixSeconds;
}

/**
 * Format Date (hoặc string) về dạng yyyy-MM-dd (không kèm T...Z)
 */
export function formatDateToYMD(
    value: Date | string | null | undefined,
): string | null {
    if (!value) return null;

    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

