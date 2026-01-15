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

	// PayOS configuration
	const payosClientId = process.env.PAYOS_CLIENT_ID;
	const payosApiKey = process.env.PAYOS_API_KEY;
	const payosChecksumKey = process.env.PAYOS_CHECKSUM_KEY;
	const payosReturnUrl = process.env.PAYOS_RETURN_URL || 'http://localhost:3103/v1/customer/order/payment/return';
	const payosCancelUrl = process.env.PAYOS_CANCEL_URL || 'http://localhost:3103/v1/customer/order/payment/cancel';

	return {
		port: parseInt(process.env.PORT || '3103', 10),
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
		payos: {
			clientId: payosClientId,
			apiKey: payosApiKey,
			checksumKey: payosChecksumKey,
			returnUrl: payosReturnUrl,
			cancelUrl: payosCancelUrl,
		},
	};
};
