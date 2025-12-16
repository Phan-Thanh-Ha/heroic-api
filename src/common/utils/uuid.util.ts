import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID (v4) sử dụng thư viện `uuid`
 */
export const generateUUID = (): string => {
	return uuidv4();
};



