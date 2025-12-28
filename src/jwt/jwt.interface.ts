//#region Customer
export interface JwtPayloadCustomer {
	customerId: number;
	customerCode: string;
	fullName: string;
	email: string;
	facebookId: string | null;
	googleId: string | null;
}
//#endregion

//#region Admin
export interface JwtPayloadAdmin {
	id: number;
	uuid: string;
	code: string;
	positionId: number;
	departmentId: number;
	fullName: string;
	email: string;
}
//#endregion`