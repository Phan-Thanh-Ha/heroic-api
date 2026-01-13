import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HTTP_STATUS_ENUM } from '@common';

export const ApiGetWebSocketUrlSwagger = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Lấy WebSocket URL',
      description: 'Lấy WebSocket URL',
    }),
    ApiResponse({
      status: HTTP_STATUS_ENUM.OK,
      description: 'WebSocket URL',
      schema: {
        type: 'object',
        properties: {
          url: { type: 'string', example: 'ws://localhost:3103/admin/notifications?token=YOUR_JWT_TOKEN&type=admin' },
        },
      },
    }),
  );
};
