export const tokenLifeTime = {
	// 1. Access Token: Ngắn, bảo mật cao
    accessToken: '30d',                    // JWT Expire string
    refreshToken: '30d',                  // JWT Expire string
    redisAccessToken: 60 * 60,            // 1 giờ (giây) - khớp với JWT
    redisRefreshToken: 30 * 24 * 60 * 60, // 30 ngày (giây)
    refreshTokenCookie: 30 * 24 * 60 * 60 * 1000, // 30 ngày (ms)
};

export const MetadataKey = {
	PERMISSION: 'permission',
};

export const StrategyKey = {
	LOCAL: 'local',
	JWT_CUSTOMER: 'jwt_customer',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const PERMISSIONS_KEY = 'permissions';