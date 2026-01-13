# Notifications Gateway

Gateway xử lý real-time notifications cho admin users qua Socket.IO.

## Namespace

`/admin/notifications`

## Cấu trúc thư mục

```
notifications/
├── notifications.gateway.ts      # Gateway chính
├── notifications.service.ts      # Business logic
├── notifications.module.ts       # Module definition
├── index.ts                      # Export file
│
├── dto/                          # Data Transfer Objects
│   ├── create-notification.dto.ts
│   ├── update-notification.dto.ts
│   ├── mark-as-read.dto.ts
│   └── get-notifications.dto.ts
│
├── entities/                     # Entities
│   └── notification.entity.ts
│
├── interfaces/                   # TypeScript interfaces
│   └── notification.interface.ts
│
├── constants/                    # Constants
│   └── notification-events.constants.ts
│
└── swagger/                      # Swagger decorators
    ├── get-connection-info.swagger.ts
    ├── get-websocket-url.swagger.ts
    └── index.ts
```

## Events

### Client → Server

- `join-room` - Join vào một room cụ thể
- `leave-room` - Rời khỏi một room
- `send-notification` - Gửi notification
- `mark-as-read` - Đánh dấu notification đã đọc
- `get-notifications` - Lấy danh sách notifications

### Server → Client

- `connection-success` - Kết nối thành công
- `new-notification` - Notification mới
- `notification-updated` - Notification được cập nhật
- `notifications-list` - Danh sách notifications
- `join-room-response` - Response khi join room
- `leave-room-response` - Response khi leave room
- `send-notification-response` - Response khi gửi notification
- `error` - Lỗi xảy ra

## Rooms

Gateway tự động join user vào các rooms sau khi kết nối:

- `user:{userId}` - Room riêng của user
- `role:admin` - Room của tất cả admin

## Authentication

Gateway yêu cầu authentication qua `SocketAuthGuard`.

Client cần gửi JWT token khi kết nối:

```javascript
const socket = io('http://localhost:3103/admin/notifications', {
    auth: {
        token: 'YOUR_JWT_TOKEN',
        type: 'admin'
    }
});
```

## Usage Example

### Server-Side

```typescript
import { NotificationsGateway } from '@socket/admin/notifications';

// Inject vào service khác để gửi notification
constructor(private notificationsGateway: NotificationsGateway) {}

// Gửi notification đến user cụ thể
this.notificationsGateway.emitToUser(userId, 'new-notification', data);

// Gửi notification đến tất cả admin
this.notificationsGateway.emitToAllAdmins('new-notification', data);
```

### Client-Side

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3103/admin/notifications', {
    auth: { token: 'YOUR_TOKEN', type: 'admin' }
});

// Lắng nghe notification mới
socket.on('new-notification', (notification) => {
    console.log('New notification:', notification);
});

// Gửi notification
socket.emit('send-notification', {
    title: 'Test',
    message: 'Hello World',
    userId: 123
});
```

## Testing

Sử dụng file HTML test client hoặc Postman để test WebSocket connection.

Xem thêm trong tài liệu chính: `docs/SocketIo.md`
