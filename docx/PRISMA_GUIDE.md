# Hướng Dẫn Prisma Từ Cơ Bản Đến Nâng Cao


## 1. Giới Thiệu Prisma

### Prisma là gì?
Prisma là một **ORM (Object-Relational Mapping)** hiện đại cho Node.js và TypeScript. Nó giúp bạn:
- Làm việc với database một cách type-safe
- Tự động generate TypeScript types từ schema
- Viết queries dễ đọc và dễ bảo trì
- Hỗ trợ migrations tự động

### Các thành phần chính:
1. **Prisma Schema** (`schema.prisma`): Định nghĩa database structure
2. **Prisma Client**: Auto-generated client để query database
3. **Prisma Migrate**: Quản lý database migrations
4. **Prisma Studio**: GUI để xem và chỉnh sửa data

---

## 2. Cài Đặt và Cấu Hình

### 2.1. Cài đặt Prisma
```bash
npm install prisma @prisma/client
# hoặc
yarn add prisma @prisma/client
```

### 2.2. Khởi tạo Prisma
```bash
npx prisma init
```

Lệnh này sẽ tạo:
- `prisma/schema.prisma`: File schema chính
- `.env`: File chứa DATABASE_URL

### 2.3. Cấu hình Database URL
Trong file `.env`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
```

### 2.4. Generate Prisma Client
Sau khi chỉnh sửa schema, chạy:
```bash
npx prisma generate
```

---

## 3. Schema Prisma - Cơ Bản

### 3.1. Cấu trúc Schema File

```prisma
// Generator - định nghĩa client sẽ được generate như thế nào
generator client {
  provider = "prisma-client-js"
}

// Datasource - kết nối database
datasource db {
  provider = "mysql"  // hoặc "postgresql", "sqlite", "mongodb"
  url      = env("DATABASE_URL")
}

// Models - định nghĩa các bảng
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String?
}
```

### 3.2. Các Provider Database
- `mysql`: MySQL
- `postgresql`: PostgreSQL
- `sqlite`: SQLite
- `mongodb`: MongoDB
- `sqlserver`: SQL Server

### 3.3. Định Nghĩa Model Cơ Bản

```prisma
model User {
  // Primary Key
  id        Int      @id @default(autoincrement())
  
  // Required fields
  email     String   @unique
  password  String
  
  // Optional fields (nullable)
  name      String?
  
  // Boolean với default value
  isActive  Boolean  @default(true)
  
  // DateTime với auto-update
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Map tên column trong database (snake_case)
  @@map("users")
}
```

---

## 4. Các Loại Dữ Liệu và Attributes

### 4.1. Scalar Types

| Prisma Type | MySQL Type | Mô tả |
|------------|------------|-------|
| `String` | VARCHAR, TEXT | Chuỗi ký tự |
| `Int` | INT | Số nguyên |
| `Float` | FLOAT, DOUBLE | Số thực |
| `Boolean` | BOOLEAN, TINYINT | True/False |
| `DateTime` | DATETIME, TIMESTAMP | Ngày giờ |
| `Json` | JSON | JSON object |
| `Bytes` | BLOB | Binary data |
| `BigInt` | BIGINT | Số nguyên lớn |
| `Decimal` | DECIMAL | Số thập phân chính xác |

### 4.2. Field Attributes

#### @id - Primary Key
```prisma
id Int @id
```

#### @default - Giá trị mặc định
```prisma
// Auto increment
id Int @id @default(autoincrement())

// Giá trị mặc định
isActive Boolean @default(true)
createdAt DateTime @default(now())

// Auto update khi record thay đổi
updatedAt DateTime @updatedAt
```

#### @unique - Unique constraint
```prisma
email String @unique
```

#### @map - Map tên column
```prisma
// Map field name sang column name trong database
isActive Boolean @default(true) @map("is_active")
createdAt DateTime @default(now()) @map("created_at")
```

#### @db - Chỉ định kiểu dữ liệu database
```prisma
email String @db.VarChar(255)
name  String @db.VarChar(100)
bio   String @db.Text
```

#### @relation - Định nghĩa quan hệ
```prisma
userId Int @map("user_id")
user   User @relation(fields: [userId], references: [id])
```

### 4.3. Model Attributes

#### @@map - Map tên table
```prisma
model User {
  // ...
  @@map("users")
}
```

#### @@unique - Composite unique constraint
```prisma
model User {
  email    String
  provider String
  @@unique([email, provider])
}
```

#### @@index - Tạo index
```prisma
model Login {
  userId  Int
  loginAt DateTime
  @@index([userId])
  @@index([loginAt])
  @@index([userId, loginAt]) // Composite index
}
```

#### @@id - Composite primary key
```prisma
model UserRole {
  userId Int
  roleId Int
  @@id([userId, roleId])
}
```

---

## 5. Relations (Quan Hệ)

### 5.1. One-to-Many (1-n)

**Ví dụ: 1 User có nhiều Login**

```prisma
model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  logins Login[] // Một User có nhiều Login
}

model Login {
  id     Int  @id @default(autoincrement())
  userId Int  @map("user_id")
  user   User @relation(fields: [userId], references: [id])
  // Login thuộc về 1 User
}
```

### 5.2. One-to-One (1-1)

**Ví dụ: 1 User có 1 Profile**

```prisma
model User {
  id      Int     @id @default(autoincrement())
  email   String  @unique
  profile Profile? // Optional - có thể không có profile
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique @map("user_id") // Unique để đảm bảo 1-1
  user   User @relation(fields: [userId], references: [id])
}
```

### 5.3. Many-to-Many (n-n)

**Cách 1: Implicit Many-to-Many (Prisma tự tạo bảng trung gian)**

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  roles Role[]
}

model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique
  users User[]
}
```

**Cách 2: Explicit Many-to-Many (Tự định nghĩa bảng trung gian)**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  userRoles UserRole[]
}

model Role {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  userRoles UserRole[]
}

model UserRole {
  id     Int  @id @default(autoincrement())
  userId Int  @map("user_id")
  roleId Int  @map("role_id")
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  
  @@unique([userId, roleId])
  @@index([userId])
  @@index([roleId])
}
```

### 5.4. Self Relations (Quan hệ với chính nó)

**Ví dụ: User có thể follow nhiều User khác**

```prisma
model User {
  id          Int       @id @default(autoincrement())
  email       String    @unique
  followers   Follow[]  @relation("UserFollowers")
  following   Follow[]  @relation("UserFollowing")
}

model Follow {
  id          Int  @id @default(autoincrement())
  followerId  Int  @map("follower_id")
  followingId Int  @map("following_id")
  follower    User @relation("UserFollowers", fields: [followerId], references: [id])
  following   User @relation("UserFollowing", fields: [followingId], references: [id])
  
  @@unique([followerId, followingId])
}
```

### 5.5. Cascade Actions

```prisma
model User {
  id     Int     @id @default(autoincrement())
  logins Login[]
}

model Login {
  id     Int  @id @default(autoincrement())
  userId Int  @map("user_id")
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  // Khi User bị xóa, tất cả Login của User đó cũng bị xóa
}
```

**Các cascade options:**
- `onDelete: Cascade` - Xóa các record liên quan
- `onDelete: Restrict` - Không cho phép xóa nếu có record liên quan
- `onDelete: SetNull` - Set foreign key thành null
- `onDelete: NoAction` - Không làm gì (database sẽ xử lý)

---

## 6. Prisma Client - Query Cơ Bản

### 6.1. Khởi Tạo Prisma Client

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

### 6.2. CREATE - Tạo mới record

#### Tạo một record đơn giản
```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'hashed_password',
    isActive: true
  }
});
```

#### Tạo record với relation
```typescript
const login = await prisma.login.create({
  data: {
    userId: 1,
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...',
    deviceType: 'desktop',
    loginStatus: 'success',
    user: {
      connect: { id: 1 } // Kết nối với User có id = 1
    }
  }
});

// Hoặc đơn giản hơn
const login = await prisma.login.create({
  data: {
    userId: 1,
    ipAddress: '192.168.1.1',
    // ...
  }
});
```

#### Tạo nhiều records cùng lúc
```typescript
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', password: 'pass1' },
    { email: 'user2@example.com', password: 'pass2' },
    { email: 'user3@example.com', password: 'pass3' }
  ],
  skipDuplicates: true // Bỏ qua nếu email đã tồn tại
});
```

### 6.3. READ - Đọc dữ liệu

#### Tìm một record theo unique field
```typescript
const user = await prisma.user.findUnique({
  where: {
    id: 1
    // hoặc email: 'user@example.com'
  }
});
```

#### Tìm record đầu tiên thỏa điều kiện
```typescript
const user = await prisma.user.findFirst({
  where: {
    isActive: true,
    name: {
      contains: 'John'
    }
  }
});
```

#### Tìm nhiều records
```typescript
const users = await prisma.user.findMany({
  where: {
    isActive: true
  }
});
```

#### Đếm số lượng records
```typescript
const count = await prisma.user.count({
  where: {
    isActive: true
  }
});
```

#### Kiểm tra record có tồn tại không
```typescript
const exists = await prisma.user.findFirst({
  where: { email: 'user@example.com' },
  select: { id: true } // Chỉ lấy id để tối ưu
});
```

### 6.4. UPDATE - Cập nhật dữ liệu

#### Cập nhật một record
```typescript
const user = await prisma.user.update({
  where: {
    id: 1
  },
  data: {
    name: 'Jane Doe',
    isActive: false
  }
});
```

#### Cập nhật nhiều records
```typescript
const result = await prisma.user.updateMany({
  where: {
    isActive: true,
    createdAt: {
      lt: new Date('2024-01-01') // Nhỏ hơn ngày này
    }
  },
  data: {
    isActive: false
  }
});

console.log(`Đã cập nhật ${result.count} records`);
```

#### Upsert (Update nếu tồn tại, Create nếu không)
```typescript
const user = await prisma.user.upsert({
  where: {
    email: 'user@example.com'
  },
  update: {
    name: 'Updated Name',
    isActive: true
  },
  create: {
    email: 'user@example.com',
    name: 'New Name',
    password: 'hashed_password'
  }
});
```

### 6.5. DELETE - Xóa dữ liệu

#### Xóa một record
```typescript
const user = await prisma.user.delete({
  where: {
    id: 1
  }
});
```

#### Xóa nhiều records
```typescript
const result = await prisma.user.deleteMany({
  where: {
    isActive: false
  }
});

console.log(`Đã xóa ${result.count} records`);
```

#### Xóa tất cả records (cẩn thận!)
```typescript
await prisma.user.deleteMany({});
```

---

## 7. Query Nâng Cao

### 7.1. Filtering (Lọc dữ liệu)

#### Các toán tử so sánh
```typescript
const users = await prisma.user.findMany({
  where: {
    // So sánh số
    id: { gt: 10 },        // Greater than (>)
    id: { gte: 10 },       // Greater than or equal (>=)
    id: { lt: 100 },       // Less than (<)
    id: { lte: 100 },      // Less than or equal (<=)
    
    // So sánh chuỗi
    email: { contains: 'gmail' },      // Chứa chuỗi
    email: { startsWith: 'admin' },    // Bắt đầu bằng
    email: { endsWith: '.com' },       // Kết thúc bằng
    
    // So sánh ngày
    createdAt: { 
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    },
    
    // In array
    id: { in: [1, 2, 3, 4, 5] },
    
    // Not
    isActive: { not: false },
    email: { not: { contains: 'test' } },
    
    // Null check
    name: null,           // Là null
    name: { not: null }   // Không phải null
  }
});
```

#### AND, OR, NOT
```typescript
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      { email: { contains: 'gmail' } }
    ],
    OR: [
      { name: { contains: 'John' } },
      { name: { contains: 'Jane' } }
    ],
    NOT: {
      email: { contains: 'test' }
    }
  }
});
```

### 7.2. Include - Lấy dữ liệu liên quan

```typescript
// Lấy User kèm tất cả Login của user đó
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    logins: true
  }
});

// Lấy User với Login và LoginDetail
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    logins: {
      include: {
        loginDetails: true
      }
    }
  }
});

// Lọc và sắp xếp trong include
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    logins: {
      where: {
        loginStatus: 'success'
      },
      orderBy: {
        loginAt: 'desc'
      },
      take: 10 // Chỉ lấy 10 login gần nhất
    }
  }
});
```

### 7.3. Select - Chọn fields cụ thể

```typescript
// Chỉ lấy một số fields
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true,
    // Không lấy password, isActive, etc.
    logins: {
      select: {
        id: true,
        loginAt: true,
        loginStatus: true
      }
    }
  }
});
```

### 7.4. Sorting (Sắp xếp)

```typescript
// Sắp xếp đơn giản
const users = await prisma.user.findMany({
  orderBy: {
    createdAt: 'desc' // 'asc' hoặc 'desc'
  }
});

// Sắp xếp theo nhiều fields
const users = await prisma.user.findMany({
  orderBy: [
    { isActive: 'desc' },
    { createdAt: 'desc' }
  ]
});

// Sắp xếp trong relation
const users = await prisma.user.findMany({
  include: {
    logins: {
      orderBy: {
        loginAt: 'desc'
      }
    }
  }
});
```

### 7.5. Pagination (Phân trang)

#### Offset Pagination
```typescript
const page = 1;
const pageSize = 10;
const skip = (page - 1) * pageSize;

const users = await prisma.user.findMany({
  skip: skip,
  take: pageSize,
  orderBy: {
    createdAt: 'desc'
  }
});

// Lấy tổng số để tính total pages
const total = await prisma.user.count();
const totalPages = Math.ceil(total / pageSize);
```

#### Cursor Pagination (Hiệu quả hơn cho large datasets)
```typescript
// Lần đầu
const firstPage = await prisma.user.findMany({
  take: 10,
  orderBy: { id: 'asc' }
});

// Lần sau (dùng cursor từ record cuối cùng)
const nextPage = await prisma.user.findMany({
  take: 10,
  skip: 1,
  cursor: {
    id: lastUserId // ID của record cuối cùng từ page trước
  },
  orderBy: { id: 'asc' }
});
```

### 7.6. Aggregation (Tính toán)

```typescript
// Đếm
const count = await prisma.user.count({
  where: { isActive: true }
});

// Tính trung bình, tổng, min, max
const stats = await prisma.login.aggregate({
  where: {
    loginStatus: 'success'
  },
  _count: {
    id: true
  },
  _avg: {
    userId: true
  },
  _sum: {
    userId: true
  },
  _min: {
    loginAt: true
  },
  _max: {
    loginAt: true
  }
});

// Group by (sử dụng groupBy)
const loginStats = await prisma.login.groupBy({
  by: ['loginStatus', 'deviceType'],
  _count: {
    id: true
  },
  where: {
    loginAt: {
      gte: new Date('2024-01-01')
    }
  }
});
```

### 7.7. Raw Queries (SQL thuần)

```typescript
// Raw query cho SELECT
const users = await prisma.$queryRaw`
  SELECT * FROM users 
  WHERE is_active = true 
  AND created_at > ${new Date('2024-01-01')}
`;

// Raw query với parameters
const users = await prisma.$queryRaw`
  SELECT * FROM users 
  WHERE email LIKE ${'%gmail%'}
  LIMIT ${10}
`;

// Raw query cho INSERT, UPDATE, DELETE
await prisma.$executeRaw`
  UPDATE users 
  SET is_active = false 
  WHERE created_at < ${new Date('2023-01-01')}
`;

// Raw query với Prisma.sql (an toàn hơn)
import { Prisma } from '@prisma/client';

const searchTerm = 'gmail';
const users = await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM users WHERE email LIKE ${`%${searchTerm}%`}`
);
```

### 7.8. Nested Writes (Ghi lồng nhau)

```typescript
// Tạo User kèm Login
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: 'hashed_password',
    logins: {
      create: {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        deviceType: 'desktop',
        loginStatus: 'success',
        loginDetails: {
          create: {
            action: 'login_attempt',
            status: 'success',
            message: 'Login successful'
          }
        }
      }
    }
  }
});

// Tạo Login cho User đã tồn tại
const login = await prisma.login.create({
  data: {
    userId: 1,
    ipAddress: '192.168.1.1',
    loginDetails: {
      createMany: {
        data: [
          { action: 'login_attempt', status: 'success' },
          { action: 'password_check', status: 'success' }
        ]
      }
    }
  }
});

// Update User và tạo Login mới
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Updated Name',
    logins: {
      create: {
        ipAddress: '192.168.1.2',
        deviceType: 'mobile'
      }
    }
  }
});
```

### 7.9. Connect, Disconnect, Set (Quản lý relations)

```typescript
// Connect - Kết nối với record đã tồn tại
const login = await prisma.login.update({
  where: { id: 1 },
  data: {
    user: {
      connect: { id: 2 } // Kết nối với User có id = 2
    }
  }
});

// Disconnect - Ngắt kết nối (chỉ dùng cho optional relations)
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      disconnect: true
    }
  }
});

// Set - Thay thế tất cả relations (Many-to-Many)
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    roles: {
      set: [
        { id: 1 },
        { id: 2 }
      ]
    }
  }
});
```

---

## 8. Transactions

### 8.1. Sequential Transactions

```typescript
// Thực hiện nhiều operations tuần tự
const result = await prisma.$transaction(async (tx) => {
  // Tạo User
  const user = await tx.user.create({
    data: {
      email: 'user@example.com',
      password: 'hashed_password'
    }
  });

  // Tạo Login cho User vừa tạo
  const login = await tx.login.create({
    data: {
      userId: user.id,
      ipAddress: '192.168.1.1',
      loginStatus: 'success'
    }
  });

  // Update User
  await tx.user.update({
    where: { id: user.id },
    data: { isActive: true }
  });

  return { user, login };
});
```

### 8.2. Interactive Transactions

```typescript
// Transaction với timeout và isolation level
const result = await prisma.$transaction(
  async (tx) => {
    const user = await tx.user.create({ data: {...} });
    const login = await tx.login.create({ data: {...} });
    return { user, login };
  },
  {
    maxWait: 5000,      // Max thời gian chờ (ms)
    timeout: 10000,     // Max thời gian thực thi (ms)
    isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted
  }
);
```

### 8.3. Batch Transactions

```typescript
// Thực hiện nhiều operations song song
const [users, logins, count] = await prisma.$transaction([
  prisma.user.findMany({ where: { isActive: true } }),
  prisma.login.findMany({ where: { loginStatus: 'success' } }),
  prisma.user.count()
]);
```

---

## 9. Migrations

### 9.1. Tạo Migration

```bash
# Tạo migration từ schema
npx prisma migrate dev --name add_user_table

# Tạo migration mà không apply (chỉ tạo file)
npx prisma migrate dev --create-only --name add_user_table
```

### 9.2. Apply Migrations

```bash
# Apply migrations trong development
npx prisma migrate dev

# Apply migrations trong production
npx prisma migrate deploy
```

### 9.3. Reset Database

```bash
# Xóa tất cả data và apply lại migrations
npx prisma migrate reset
```

### 9.4. Xem Migration History

```bash
# Xem trạng thái migrations
npx prisma migrate status
```

### 9.5. Custom Migration SQL

Đôi khi bạn cần chạy SQL thuần trong migration:

```sql
-- Trong file migration: migrations/xxx_add_index/migration.sql
CREATE INDEX idx_user_email ON users(email);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
```

---

## 10. Best Practices

### 10.1. Error Handling

```typescript
try {
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'hashed_password'
    }
  });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      console.error('Email đã tồn tại');
    } else if (error.code === 'P2025') {
      // Record not found
      console.error('Không tìm thấy record');
    }
  }
  throw error;
}
```

**Các error codes phổ biến:**
- `P2002`: Unique constraint failed
- `P2025`: Record to update/delete not found
- `P2003`: Foreign key constraint failed
- `P2014`: Required relation missing

### 10.2. Connection Pooling

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
```

### 10.3. Logging

```typescript
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' }
  ]
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

### 10.4. Select vs Include

```typescript
// ❌ Không tốt - Lấy tất cả fields không cần thiết
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { logins: true }
});

// ✅ Tốt - Chỉ lấy fields cần thiết
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    logins: {
      select: {
        id: true,
        loginAt: true
      }
    }
  }
});
```

### 10.5. Batch Operations

```typescript
// ❌ Không tốt - N queries
for (const email of emails) {
  await prisma.user.create({ data: { email } });
}

// ✅ Tốt - 1 query
await prisma.user.createMany({
  data: emails.map(email => ({ email }))
});
```

### 10.6. Indexing

```prisma
model Login {
  userId  Int
  loginAt DateTime
  
  // Tạo index cho các fields thường được query
  @@index([userId])
  @@index([loginAt])
  @@index([userId, loginAt]) // Composite index
}
```

### 10.7. Type Safety

```typescript
// Sử dụng Prisma types
import { User, Prisma } from '@prisma/client';

// Type cho create input
type UserCreateInput = Prisma.UserCreateInput;

// Type cho update input
type UserUpdateInput = Prisma.UserUpdateInput;

// Type cho where clause
type UserWhereInput = Prisma.UserWhereInput;

// Type cho User với relations
type UserWithLogins = Prisma.UserGetPayload<{
  include: { logins: true }
}>;
```

### 10.8. Service Pattern với NestJS

```typescript
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { logins: true }
    });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
```

---

## 11. Ví Dụ Thực Tế

### 11.1. Authentication Flow

```typescript
// Login với tracking
async function loginUser(email: string, password: string, ipAddress: string, userAgent: string) {
  return await prisma.$transaction(async (tx) => {
    // Tìm user
    const user = await tx.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password (giả sử đã hash)
    const isValid = await verifyPassword(password, user.password);
    
    // Tạo login record
    const login = await tx.login.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
        deviceType: detectDevice(userAgent),
        loginStatus: isValid ? 'success' : 'failed',
        loginDetails: {
          create: {
            action: 'login_attempt',
            status: isValid ? 'success' : 'failed',
            message: isValid ? 'Login successful' : 'Invalid password'
          }
        }
      }
    });

    // Update user nếu login thành công
    if (isValid) {
      await tx.user.update({
        where: { id: user.id },
        data: { isActive: true }
      });
    }

    return { user, login };
  });
}
```

### 11.2. Pagination với Filters

```typescript
async function getUsersWithPagination(
  page: number = 1,
  pageSize: number = 10,
  filters: {
    isActive?: boolean;
    search?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
) {
  const skip = (page - 1) * pageSize;
  
  const where: Prisma.UserWhereInput = {};
  
  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  
  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search } },
      { name: { contains: filters.search } }
    ];
  }
  
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        logins: {
          take: 5,
          orderBy: { loginAt: 'desc' }
        }
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    data: users,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    }
  };
}
```

### 11.3. Analytics Query

```typescript
async function getLoginAnalytics(startDate: Date, endDate: Date) {
  const [stats, byStatus, byDevice, byDate] = await Promise.all([
    // Tổng quan
    prisma.login.aggregate({
      where: {
        loginAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: { id: true },
      _avg: { userId: true }
    }),
    
    // Theo status
    prisma.login.groupBy({
      by: ['loginStatus'],
      where: {
        loginAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: { id: true }
    }),
    
    // Theo device type
    prisma.login.groupBy({
      by: ['deviceType'],
      where: {
        loginAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: { id: true }
    }),
    
    // Theo ngày (dùng raw query)
    prisma.$queryRaw`
      SELECT 
        DATE(login_at) as date,
        COUNT(*) as count,
        COUNT(CASE WHEN login_status = 'success' THEN 1 END) as success_count
      FROM logins
      WHERE login_at >= ${startDate} AND login_at <= ${endDate}
      GROUP BY DATE(login_at)
      ORDER BY date ASC
    `
  ]);

  return { stats, byStatus, byDevice, byDate };
}
```

---

## 12. Tài Liệu Tham Khảo

- **Prisma Docs**: https://www.prisma.io/docs
- **Prisma Schema Reference**: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **Prisma Client API**: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference
- **Prisma Examples**: https://github.com/prisma/prisma-examples

---

## 13. Tips và Tricks

### 13.1. Prisma Studio
```bash
# Mở GUI để xem và chỉnh sửa data
npx prisma studio
```

### 13.2. Format Schema
```bash
# Format file schema.prisma
npx prisma format
```

### 13.3. Validate Schema
```bash
# Kiểm tra schema có hợp lệ không
npx prisma validate
```

### 13.4. Generate Types
```bash
# Generate Prisma Client sau khi thay đổi schema
npx prisma generate
```

### 13.5. Introspect Database
```bash
# Tạo schema từ database có sẵn
npx prisma db pull
```

---

**Chúc bạn code vui vẻ với Prisma! 🚀**

