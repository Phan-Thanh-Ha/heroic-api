export const RunENV = (): string => {
	const nodeEnv = process.env.NODE_ENV || 'development';
	return `.env.${nodeEnv}`;
};

