import { Provider } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from '@common';

// Định nghĩa các provider áp dụng cho toàn App (global)
export const providerApp: Provider[] = [
	{
		provide: APP_INTERCEPTOR,
		useClass: ResponseTransformInterceptor,
	},
];


