import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_STATUS_ENUM } from '@common';

export const ApiGetWebSocketUrlWithTokenSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Lấy WebSocket URL với token tự động (Đã đăng nhập)',
      description: `
# WebSocket Connection URL với Token

**URL này đã bao gồm token của bạn, copy trực tiếp để dùng:**

Endpoint này yêu cầu authentication. Token sẽ được lấy từ header \`x-access-token\` hoặc \`Authorization\`.
      `,
    }),
    ApiResponse({
      status: HTTP_STATUS_ENUM.OK,
      description: 'WebSocket connection URL with token',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            example: 'ws://localhost:3103/admin/notifications?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&type=admin',
            description: 'WebSocket URL với token - Copy trực tiếp để dùng',
          },
          namespace: { type: 'string', example: '/admin/notifications' },
          protocol: { type: 'string', example: 'ws' },
          host: { type: 'string', example: 'localhost:3103' },
          expiresIn: { type: 'string', example: 'Token expires based on JWT expiration time' },
          note: {
            type: 'string',
            example: 'Copy URL này trực tiếp vào Postman WebSocket request',
          },
        },
      },
    }),
  );
};
