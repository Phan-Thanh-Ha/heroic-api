import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_STATUS_ENUM } from '@common';

export const ApiGetConnectionInfoSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Socket.io Notifications - Thông tin chi tiết và Events',
    }),
    ApiResponse({
      status: HTTP_STATUS_ENUM.OK,
      description: 'Socket connection information',
      schema: {
        type: 'object',
        properties: {
          namespace: { type: 'string', example: '/admin/notifications' },
          url: { type: 'string', example: 'ws://localhost:3103/admin/notifications' },
          urlWithToken: {
            type: 'string',
            example: 'ws://localhost:3103/admin/notifications?token=YOUR_JWT_TOKEN&type=admin',
          },
          authentication: {
            type: 'object',
            properties: {
              method: { type: 'string', example: 'JWT Token' },
              location: { type: 'string', example: 'Query parameter or auth handshake' },
            },
          },
          events: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                direction: { type: 'string', enum: ['client->server', 'server->client'] },
                description: { type: 'string' },
              },
            },
          },
        },
      },
    }),
  );
};
