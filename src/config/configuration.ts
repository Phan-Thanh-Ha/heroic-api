export const configuration = () => {
	const dbHost = process.env.DB_HOST;
	const dbPort = process.env.DB_PORT || '3306';
	const dbUserName = process.env.DB_USERNAME;
	const dbPassWord = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;
	const secretKey = process.env.SECRET_KEY;

	return {
		port: parseInt(process.env.PORT || '3102', 10),
		dbHost,
		dbPort: parseInt(dbPort, 10),
		dbUserName,
		dbPassWord,
		dbName,
		ngrokUrl: process.env.NGROK_URL || null,
		secretKey,
	};
};
