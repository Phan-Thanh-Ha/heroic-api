/**
 * Socket Room Constants
 * 
 * Định nghĩa các room prefixes và helper functions cho Socket.IO rooms
 * Dùng chung cho tất cả socket gateways
 */

/**
 * Room prefixes
 */
export const ROOM_PREFIXES = {
    USER: 'user',
    ROLE: 'role',
    ROOM: 'room',
} as const;

/**
 * Helper function để tạo room name
 */
export const createRoomName = (prefix: string, id: string | number): string => {
    return `${prefix}:${id}`;
};

/**
 * Helper function để tạo user room name
 */
export const createUserRoom = (userId: string | number): string => {
    return createRoomName(ROOM_PREFIXES.USER, userId);
};

/**
 * Helper function để tạo role room name
 */
export const createRoleRoom = (role: string): string => {
    return createRoomName(ROOM_PREFIXES.ROLE, role);
};

/**
 * Helper function để tạo custom room name
 */
export const createCustomRoom = (roomId: string | number): string => {
    return createRoomName(ROOM_PREFIXES.ROOM, roomId);
};
