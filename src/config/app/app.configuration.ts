import { registerAs } from '@nestjs/config';
import { RunENV } from './config.env';

const customPathENV = RunENV();

export const ConfigENVPath = () => customPathENV;

export const ConfigRegisterAs = () =>
	registerAs('app', () => {
		return {
			nodeEnv: process.env.DB_TYPE || 'dev',
		};
	});
