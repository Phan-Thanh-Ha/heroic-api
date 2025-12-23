export const configuration = () => {
	const dbHost = process.env.DB_HOST || 'localhost'; // Dùng localhost thay vì 127.0.0.1 cho Docker Desktop trên macOS
	const dbPort = process.env.DB_PORT || '5432'; // PostgreSQL default port
	const dbUserName = process.env.DB_USERNAME;
	const dbPassWord = process.env.DB_PASSWORD;
	const dbName = process.env.DB_NAME;
	const secretKey = process.env.SECRET_KEY;

	// Resend Mail configuration
	const resendApiKey = process.env.RESEND_API_KEY;
	const resendFromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
	const resendFromName = process.env.RESEND_FROM_NAME || 'Heroic API';

	return {
		port: parseInt(process.env.PORT || '3102', 10),
		dbHost,
		dbPort: parseInt(dbPort, 10),
		dbUserName,
		dbPassWord,
		dbName,
		ngrokUrl: process.env.NGROK_URL || null,
		secretKey,
		mail: {
			resend: {
				apiKey: resendApiKey,
				fromEmail: resendFromEmail,
				fromName: resendFromName,
			},
		},
	};
};
