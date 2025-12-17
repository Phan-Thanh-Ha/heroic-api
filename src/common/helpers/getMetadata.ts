import { Request } from 'express';
import { DEFAULT_QUERY } from '../enums';

export const getMetadata = (req: Request, data: any[]) => {
	const { page: pageQuery, limit: limitQuery } = req.query;
	const page = +(pageQuery ? pageQuery : DEFAULT_QUERY.PAGE);
	const limit = +(limitQuery ? (+limitQuery <= +DEFAULT_QUERY.MAX_LIMIT ? limitQuery : DEFAULT_QUERY.MAX_LIMIT) : DEFAULT_QUERY.LIMIT);
	const total_items = data[1];
	const total_page = Math.ceil(data[1] / +limit);

	return {
		currentPage: page,
		limit,
		total: total_items,
		totalPage: total_page,
	};
};
