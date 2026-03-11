import { randomUUID } from 'crypto';

/**
 * Generate a UUID (v4) sử dụng Node.js built-in crypto API
 */
export const generateUUID = (): string => {
	return randomUUID();
};



