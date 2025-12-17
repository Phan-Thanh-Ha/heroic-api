import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getMetadata } from '../helpers';
import { ResponseFormat } from '../interfaces';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat> {
		const http = context.switchToHttp();
		const response = http.getResponse<Response>();
		const request = http.getRequest<Request>();
		const status = response.statusCode;

		return next.handle().pipe(
			map((data) => {
				const isArray = Array.isArray(data);
				const isPagination = isArray && data.length === 2 && typeof data[1] === 'number';

				if (isPagination) {
					const { currentPage, limit, total, totalPage } = getMetadata(request, data);

					return {
						status,
						success: true,
						code: status,
						data: {
							result: data[0],
							currentPage,
							limit,
							total,
							totalPage,
						},
					};
				}

				// Cho phép controller tự truyền message:
				// return { result: ..., message: 'Lấy tỉnh thành công' }
				if (!isArray && data && typeof data === 'object' && 'result' in (data as any)) {
					const { result, message } = data as any;
					const resultArray = Array.isArray(result) ? result : [result];

					return {
						status: 'success',
						code: status,
						success: true,
						message,
						data: {
							result: resultArray,
						},
					};
				}

				return {
					status: 'success',
					code: status,
					success: true,
					data: {
						result: isArray ? data : [data],
					},
				};
			}),
		);
	}

}
