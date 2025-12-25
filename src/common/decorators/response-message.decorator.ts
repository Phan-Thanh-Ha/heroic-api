// src/common/decorators/response-message.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE = 'response_message';

// Định nghĩa kiểu Message đa ngôn ngữ
export type MessageType = string | { vi: string; en: string; cn?: string };

// Decorator giờ nhận vào string HOẶC object đa ngôn ngữ
export const ResponseMessage = (message: MessageType) => SetMetadata(RESPONSE_MESSAGE, message);