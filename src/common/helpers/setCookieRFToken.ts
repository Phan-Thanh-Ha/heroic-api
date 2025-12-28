import { Response } from 'express';
import { tokenLifeTime } from '@common';

export const setCookieRFToken = (res: Response, refreshToken: string) => {
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,    // Bảo mật: JS không đọc được
        // secure: true,      // Chỉ gửi qua HTTPS
        sameSite: 'lax',   // 'lax' hoặc 'strict' tùy thuộc vào việc bạn có cross-site không
        path: '/',         // Cookie có hiệu lực cho toàn bộ domain
        maxAge: tokenLifeTime.refreshTokenCookie,    // Thời gian sống của cookie
    });
};