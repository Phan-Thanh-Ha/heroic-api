export const APIOkSchema = (data: { description: string; title: string; properties: any; examples: any[] }) => {
	return {
		description: data.description,
		content: {
			'application/json': {
				schema: {
					title: 'OkResponse',
					type: 'object',
					properties: {
						status: { type: 'number', default: 200 },
						data: {
							title: 'DefaultSuccessResponse',
							properties: {
								result: {
									type: 'array',
									items: {
										title: data.title,
										properties: data.properties,
									},
								},
								currentPage: { type: 'number' },
								limit: { type: 'number' },
								total: { type: 'number' },
								totalPage: { type: 'number' },
							},
						},
					},
				},
				examples: data.examples.reduce((list, e) => {
					return Object.assign(
						list,
						e.hasPagination
							? {
								[e.name]: {
									value: {
										status: 200,
										data: {
											result: [{ ...e.data }],
											currentPage: 1,
											limit: 10,
											total: 1,
											totalPage: 1,
										},
									},
								},
							}
							: {
								[e.name]: {
									value: {
										status: 200,
										data: {
											result: [{ ...e.data }],
										},
									},
								},
							},
					);
				}, {}),
			},
		},
	};
};
