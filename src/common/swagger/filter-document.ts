import { OpenAPIObject } from '@nestjs/swagger';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head'];

/**
 * Filter Swagger document theo tags
 * @param document - OpenAPI document gốc
 * @param includeTags - Tags cần giữ lại (nếu có)
 * @param excludeTags - Tags cần loại bỏ (nếu có)
 */
export const filterDocumentByTags = (
    document: OpenAPIObject,
    includeTags?: string[],
    excludeTags?: string[],
): OpenAPIObject => {
    const filtered = JSON.parse(JSON.stringify(document));

    // Filter theo includeTags
    if (includeTags?.length) {
        const filteredPaths: Record<string, any> = {};
        
        Object.entries(filtered.paths || {}).forEach(([path, pathItem]: [string, any]) => {
            Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
                const isHttpMethod = HTTP_METHODS.includes(method.toLowerCase());
                
                if (isHttpMethod && operation?.tags) {
                    const hasMatchingTag = operation.tags.some((tag: string) => includeTags.includes(tag));
                    if (hasMatchingTag) {
                        if (!filteredPaths[path]) filteredPaths[path] = {};
                        filteredPaths[path][method] = operation;
                    }
                } else if (!isHttpMethod) {
                    // Giữ lại các properties khác (parameters, etc.)
                    if (!filteredPaths[path]) filteredPaths[path] = {};
                    filteredPaths[path][method] = operation;
                }
            });
        });
        
        filtered.paths = filteredPaths;
    }

    // Filter theo excludeTags
    if (excludeTags?.length) {
        Object.entries(filtered.paths || {}).forEach(([path, pathItem]: [string, any]) => {
            Object.entries(pathItem).forEach(([method, operation]: [string, any]) => {
                if (HTTP_METHODS.includes(method.toLowerCase()) && operation?.tags) {
                    const hasExcludedTag = operation.tags.some((tag: string) => excludeTags.includes(tag));
                    if (hasExcludedTag) {
                        delete filtered.paths[path]?.[method];
                        if (!Object.keys(filtered.paths[path] || {}).length) {
                            delete filtered.paths[path];
                        }
                    }
                }
            });
        });
    }

    return filtered;
};

