export interface PaginationMeta {
	total?: number;
	currentPage?: number;
	limit?: number;
	totalPage?: number;
}

export interface ResponseFormat {
	success?: boolean;
	status: string | number;
	message?: string;
	code?: number;
	data: {
		result: any[];
		currentPage?: number;
		total?: number;
		totalPages?: number;
		limit?: number;
	};
}

