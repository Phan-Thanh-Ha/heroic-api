export interface ResponseFormat {
	status: number;
	message?: string;
	data: {
		result: any[];
		currentPage?: number;
		total?: number;
		totalPages?: number;
		limit?: number;
	};
}
