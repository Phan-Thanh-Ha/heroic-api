export interface JwtPayloadCustomer {
	customerId: number;
	customerCode: string;
	fullName: string;
	email: string;
	facebookId: string | null;
	googleId: string | null;
}
