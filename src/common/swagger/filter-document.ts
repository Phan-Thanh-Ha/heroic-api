import { OpenAPIObject } from '@nestjs/swagger';

export const filterDocumentByTags = (
    document: OpenAPIObject,
    includeTags: string[] = [],
    excludeTags: string[] = [],
): OpenAPIObject => {
    
    const newPaths: any = {};
    const usedSchemaNames = new Set<string>();

    // 1. DUYỆT QUA TỪNG ĐƯỜNG DẪN (PATH)
    for (const path in document.paths) {
        const methods = document.paths[path];
        const filteredMethods: any = {};

        for (const method in methods) {
            const operation = methods[method];
            const tags = operation.tags || [];

            // KIỂM TRA:
            // - Có nằm trong danh sách "Giữ lại" không?
            const isInclude = includeTags.length === 0 || tags.some(t => includeTags.includes(t));
            // - Có nằm trong danh sách "Loại bỏ" không?
            const isExclude = excludeTags.some(t => excludeTags.includes(t));

            // Nếu thoả mãn: (Muốn giữ) VÀ (Không bị loại bỏ)
            if (isInclude && !isExclude) {
                filteredMethods[method] = operation;

                // TÌM TÊN SCHEMA: Quét văn bản để tìm các DTO đang dùng
                const text = JSON.stringify(operation);
                const found = text.match(/\/schemas\/([a-zA-Z0-9._-]+)/g);
                found?.forEach(item => usedSchemaNames.add(item.replace('/schemas/', '')));
            }
        }

        if (Object.keys(filteredMethods).length > 0) {
            newPaths[path] = filteredMethods;
        }
    }

    // 2. LỌC SCHEMA: Chỉ lấy những DTO nào các API trên cần dùng
    const newSchemas: any = {};
    usedSchemaNames.forEach(name => {
        if (document.components?.schemas?.[name]) {
            newSchemas[name] = document.components.schemas[name];
        }
    });

    return {
        ...document,
        paths: newPaths,
        components: {
            ...document.components,
            schemas: newSchemas
        }
    };
};