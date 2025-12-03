import { join } from 'path';
import * as dotenv from 'dotenv';

const determineEnvFile = () => {
	const nodeEnv = (process.env.NODE_ENV || 'development').trim() || 'development';
	return `.env.${nodeEnv}`;
};

const envFile = determineEnvFile();
// Luôn load file env từ root project (process.cwd), không phụ thuộc vào dist/src đường dẫn build
const resolvedPath = join(process.cwd(), envFile).replace(/\\/gi, '/');

const { error } = dotenv.config({ path: resolvedPath });

// Fallback: load default .env if specific file is missing
if (error) {
	dotenv.config();
}

export const RunENV = () => (error ? '.env' : envFile);
