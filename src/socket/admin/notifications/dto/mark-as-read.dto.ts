import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * DTO for marking notification as read
 */
export class MarkAsReadDto {
    @IsNumber()
    @IsNotEmpty()
    notificationId!: number;
}
