/**
 * Events từ Client → Server
 */
export const CLIENT_EVENTS = {
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    SEND_NOTIFICATION: 'send-notification',
    MARK_AS_READ: 'mark-as-read',
    GET_NOTIFICATIONS: 'get-notifications',
} as const;

/**
 * Events từ Server → Client
 */
export const SERVER_EVENTS = {
    CONNECTION_SUCCESS: 'connection-success',
    NEW_NOTIFICATION: 'new-notification',
    NOTIFICATION_UPDATED: 'notification-updated',
    NOTIFICATIONS_LIST: 'notifications-list',
    JOIN_ROOM_RESPONSE: 'join-room-response',
    LEAVE_ROOM_RESPONSE: 'leave-room-response',
    SEND_NOTIFICATION_RESPONSE: 'send-notification-response',
    ERROR: 'error',
} as const;

// Re-export room helpers từ common để backward compatibility
export {
    createCustomRoom, createRoleRoom, createRoomName,
    createUserRoom, ROOM_PREFIXES
} from '@common';

