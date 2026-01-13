import { registerAs } from '@nestjs/config';
import { configuration } from '../configuration';
import { WS_ROUTES } from '@common';

export const socketConfig = () =>
    registerAs('socket', () => {
        const config = configuration();
        return {
            cors: {
                origin: config.ngrokUrl || '*',
                credentials: true,
            },
            transports: ['websocket', 'polling'] as const,
            pingTimeout: 60000,
            pingInterval: 25000,
            namespaces: WS_ROUTES,
        };
    });