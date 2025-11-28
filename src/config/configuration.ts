export const configuration = () => {
	const dbHost = process.env.DB_HOST;
	const dbPort = process.env.DB_PORT || '3306';
	const dbUserName = process.env.DB_USERNAME;
	const dbPassWord = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;

	// Tạo DATABASE_URL cho Prisma
	const databaseUrl = dbHost && dbUserName && dbPassWord && dbName
		? `mysql://${dbUserName}:${dbPassWord}@${dbHost}:${dbPort}/${dbName}`
		: undefined;

	return {
		port: parseInt(process.env.PORT || '4040', 10),
		dbHost,
		dbPort: parseInt(dbPort, 10),
		dbUserName,
		dbPassWord,
		dbName,
		databaseUrl,
	};
};
