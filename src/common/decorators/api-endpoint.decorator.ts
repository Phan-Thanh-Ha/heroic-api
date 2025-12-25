// src/common/decorators/api-endpoint.decorator.ts
import { applyDecorators, Delete, Get, HttpCode, Post, Put, RequestMethod, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

// Interface tùy chọn
interface ApiEndpointOptions {
    summary: string;
    description?: string;
    response?: any;               // DTO trả về (để Swagger hiện Schema)
    auth?: boolean;               // Có thể mở rộng sau này (VD: public/private)
    swagger?: MethodDecorator;    // Các decorator phụ (VD: @ApiLoginWithGoogle)
    status?: number;
}

// HÀM LÕI (FACTORY)
function createApiDecorator(
    method: RequestMethod,
    path: string,
    options: ApiEndpointOptions
) {
    // Logic: POST trả về 201, còn lại 200
    const status = options.response?.status || (method === RequestMethod.POST ? 201 : 200);

    const decorators = [
        // 1. Chọn Method NestJS
        method === RequestMethod.POST ? Post(path) :
            method === RequestMethod.GET ? Get(path) :
                method === RequestMethod.PUT ? Put(path) :
                    method === RequestMethod.DELETE ? Delete(path) : Get(path),

        // 2. HTTP Code & Swagger cơ bản
        HttpCode(status),
        ApiOperation({ summary: options.summary, description: options.description }),

        // 3. Tự động gắn Interceptor (Log & Error Handling)
        UseInterceptors(LoggingInterceptor),
    ];

    // 4. Nếu có DTO trả về -> Gắn vào Swagger response
    if (options.response) {
        decorators.push(ApiResponse({ status, type: options.response }));
    }

    // 5. Decorator phụ (nếu có)
    if (options.swagger) {
        decorators.push(options.swagger);
    }

    return applyDecorators(...decorators);
}

// EXPORT CÁC HÀM DÙNG CHUNG (Tên Generic)
export function ApiGet(path: string, options: ApiEndpointOptions) {
    return createApiDecorator(RequestMethod.GET, path, options);
}

export function ApiPost(path: string, options: ApiEndpointOptions) {
    return createApiDecorator(RequestMethod.POST, path, options);
}

export function ApiPut(path: string, options: ApiEndpointOptions) {
    return createApiDecorator(RequestMethod.PUT, path, options);
}

export function ApiDelete(path: string, options: ApiEndpointOptions) {
    return createApiDecorator(RequestMethod.DELETE, path, options);
}