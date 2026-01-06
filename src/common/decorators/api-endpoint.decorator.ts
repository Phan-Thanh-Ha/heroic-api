import { applyDecorators, Delete, Get, HttpCode, Patch, Post, Put, RequestMethod, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

interface ApiEndpointOptions {
    summary: string;
    description?: string;
    response?: any;               // Nếu có, sẽ tự động tạo Response thành công
    swagger?: MethodDecorator;    // Nơi bạn truyền file swagger lẻ vào
    status?: number;
}

function createApiDecorator(
    method: RequestMethod,
    path: string,
    options: ApiEndpointOptions
) {
    // Ưu tiên: status truyền vào > status của response object > mặc định theo Method
    const status = options.status || options.response?.status || (method === RequestMethod.POST ? 201 : 200);

    const decorators: any[] = [
        // 1. Định nghĩa Method
        method === RequestMethod.POST ? Post(path) :
            method === RequestMethod.GET ? Get(path) :
                method === RequestMethod.PUT ? Put(path) :
                    method === RequestMethod.PATCH ? Patch(path) :
                        method === RequestMethod.DELETE ? Delete(path) : Get(path),
        
        // 2. Ép mã HTTP thực tế trả về
        HttpCode(status),
        
        // 3. Gắn Summary cơ bản
        ApiOperation({ summary: options.summary, description: options.description }),

        // 4. Interceptor
        UseInterceptors(LoggingInterceptor),
    ];

    // 5. Chỉ gắn Response nếu bạn truyền rõ 'response' vào options
    // Nếu bạn muốn tự cấu hình hoàn toàn ở file lẻ, hãy bỏ trống trường này ở Controller
    if (options.response && typeof options.response !== 'function') {
        decorators.push(ApiResponse({ 
            status, 
            type: options.response,
            description: status === 201 ? 'Created' : 'Success'
        }));
    }

    // 6. Gắn các cấu hình riêng biệt từ file bên ngoài (Swagger lẻ)
    if (options.swagger) {
        decorators.push(options.swagger);
    }

    return applyDecorators(...decorators);
}

export function ApiPost(path: string, options: ApiEndpointOptions) { return createApiDecorator(RequestMethod.POST, path, options); }
export function ApiGet(path: string, options: ApiEndpointOptions) { return createApiDecorator(RequestMethod.GET, path, options); }
export function ApiPatch(path: string, options: ApiEndpointOptions) { return createApiDecorator(RequestMethod.PATCH, path, options); }
export function ApiPut(path: string, options: ApiEndpointOptions) { return createApiDecorator(RequestMethod.PUT, path, options); }
export function ApiDelete(path: string, options: ApiEndpointOptions) { return createApiDecorator(RequestMethod.DELETE, path, options); }