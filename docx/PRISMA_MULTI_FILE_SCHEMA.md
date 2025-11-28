# Hướng Dẫn Chia Nhỏ Prisma Schema (Multi-File Schema)

## 📋 Tổng Quan

Prisma hỗ trợ **multi-file schema** từ version 5.15.0 và chính thức từ 6.7.0. Bạn **KHÔNG CẦN** dùng `prisma-schema-splitter` nữa.

### ✅ Khi Nào Nên Chia Nhỏ Schema?

**Nên chia nhỏ khi:**
- Dự án có **10+ models** trở lên
- Schema file **> 500 dòng**
- Có nhiều **modules/domains** khác nhau (Auth, Product, Order, Payment, etc.)
- Team lớn, nhiều người cùng làm việc với schema
- Cần tổ chức code theo **domain-driven design**

**Chưa cần chia nhỏ khi:**
- Schema < 10 models
- File < 300 dòng
- Dự án nhỏ, ít người làm việc

### 📊 Đánh Giá Dự Án Hiện Tại

**Hiện tại:**
- ✅ 3 models (User, Login, LoginDetail)
- ✅ ~68 dòng code
- ✅ 1 module (Authentication)

**Kết luận:** Chưa cần chia nhỏ ngay, nhưng nếu dự án sẽ phát triển lớn, nên chuẩn bị cấu trúc sẵn.

---

## 🏗️ Cấu Trúc Multi-File Schema

### Cách 1: Chia Theo Module/Domain (Khuyến nghị)

```
prisma/
├── schema/
│   ├── _base.prisma          # Generator & Datasource
│   ├── auth/
│   │   ├── user.prisma
│   │   ├── login.prisma
│   │   └── login-detail.prisma
│   ├── product/
│   │   ├── product.prisma
│   │   └── category.prisma
│   └── order/
│       ├── order.prisma
│       └── order-item.prisma
└── migrations/
```

### Cách 2: Chia Theo Loại (Models, Enums, Types)

```
prisma/
├── schema/
│   ├── _base.prisma          # Generator & Datasource
│   ├── models/
│   │   ├── user.prisma
│   │   ├── login.prisma
│   │   └── product.prisma
│   └── enums/
│       ├── user-status.prisma
│       └── order-status.prisma
└── migrations/
```

---

## 🚀 Hướng Dẫn Triển Khai

### Bước 1: Tạo Cấu Trúc Thư Mục

```bash
mkdir -p prisma/schema/auth
```

### Bước 2: Tạo File Base

**`prisma/schema/_base.prisma`**
```prisma
// Generator & Datasource - Phải có trong 1 file
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Bước 3: Chia Models Theo Module

**`prisma/schema/auth/user.prisma`**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @db.VarChar(255) @unique
  name      String?  @db.VarChar(100)
  password  String   @db.VarChar(255)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  logins    Login[]

  @@map("users")
}
```

**`prisma/schema/auth/login.prisma`**
```prisma
model Login {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  ipAddress   String?  @db.VarChar(45) @map("ip_address")
  userAgent   String?  @db.Text @map("user_agent")
  deviceType  String?  @db.VarChar(50) @map("device_type")
  loginStatus String   @db.VarChar(20) @default("success") @map("login_status")
  loginAt     DateTime @default(now()) @map("login_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  loginDetails LoginDetail[]

  @@index([userId])
  @@index([loginAt])
  @@map("logins")
}
```

**`prisma/schema/auth/login-detail.prisma`**
```prisma
model LoginDetail {
  id          Int      @id @default(autoincrement())
  loginId     Int      @map("login_id")
  action      String   @db.VarChar(50)
  status      String   @db.VarChar(20)
  message     String?  @db.VarChar(255)
  metadata    String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  login       Login    @relation(fields: [loginId], references: [id], onDelete: Cascade)

  @@index([loginId])
  @@index([action])
  @@map("login_details")
}
```

### Bước 4: Cấu Hình Prisma

**Cập nhật `package.json`:**
```json
{
  "prisma": {
    "schema": "./prisma/schema"
  }
}
```

**Hoặc trong `prisma.config.ts` (nếu có):**
```typescript
export default defineConfig({
  schema: "prisma/schema",  // Đường dẫn đến thư mục schema
  migrations: {
    path: "prisma/migrations",
  },
  // ...
});
```

### Bước 5: Generate Prisma Client

```bash
npx prisma generate
```

### Bước 6: Chạy Migrations

```bash
npx prisma migrate dev --name split_schema
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. File `_base.prisma` Bắt Buộc
- Phải có **generator** và **datasource** trong 1 file
- Thường đặt tên `_base.prisma` hoặc `schema.prisma` (file chính)
- File bắt đầu bằng `_` sẽ được load đầu tiên

### 2. Thứ Tự Load Files
- Files được load theo **thứ tự alphabet**
- Nên dùng prefix số hoặc `_` để control thứ tự:
  - `_base.prisma` (load đầu tiên)
  - `01-user.prisma`
  - `02-login.prisma`

### 3. Relations Giữa Các Files
- Models có thể reference nhau **bất kỳ file nào**
- Prisma sẽ tự động merge tất cả files

### 4. Enums và Types
- Enums có thể đặt riêng file hoặc cùng file với model sử dụng
- Ví dụ: `prisma/schema/enums/user-status.prisma`

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

### 5. Comments và Documentation
- Có thể thêm comments ở đầu mỗi file để mô tả module
- Ví dụ:

```prisma
// ============================================
// AUTHENTICATION MODULE
// Models: User, Login, LoginDetail
// ============================================
```

---

## 📝 Ví Dụ Cấu Trúc Hoàn Chỉnh

### Dự Án E-commerce

```
prisma/
├── schema/
│   ├── _base.prisma
│   ├── auth/
│   │   ├── user.prisma
│   │   ├── role.prisma
│   │   └── permission.prisma
│   ├── product/
│   │   ├── product.prisma
│   │   ├── category.prisma
│   │   └── product-image.prisma
│   ├── order/
│   │   ├── order.prisma
│   │   ├── order-item.prisma
│   │   └── shipping.prisma
│   ├── payment/
│   │   ├── payment.prisma
│   │   └── transaction.prisma
│   └── enums/
│       ├── order-status.prisma
│       ├── payment-status.prisma
│       └── user-role.prisma
└── migrations/
```

---

## 🔄 Migration Từ Single File Sang Multi-File

### Cách 1: Manual (An toàn)

1. Backup schema hiện tại
2. Tạo cấu trúc thư mục mới
3. Copy từng model vào file tương ứng
4. Xóa file `schema.prisma` cũ
5. Cập nhật config
6. Test với `prisma validate`
7. Generate client và test

### Cách 2: Dùng Script (Nhanh hơn)

```bash
# Tạo script để tự động chia
# (Cần viết script riêng hoặc dùng tool)
```

---

## 🧪 Testing Sau Khi Chia Nhỏ

```bash
# 1. Validate schema
npx prisma validate

# 2. Format schema
npx prisma format

# 3. Generate client
npx prisma generate

# 4. Check migrations
npx prisma migrate status

# 5. Test với Prisma Studio
npx prisma studio
```

---

## 🎯 Best Practices

### 1. Đặt Tên Files
- ✅ `user.prisma` (rõ ràng)
- ✅ `auth-user.prisma` (có prefix module)
- ❌ `u.prisma` (quá ngắn)
- ❌ `userModel.prisma` (redundant)

### 2. Tổ Chức Modules
- Nhóm models liên quan vào cùng thư mục
- Mỗi module nên có README.md giải thích

### 3. Version Control
- Commit từng file riêng biệt
- Dễ review và track changes
- Giảm conflict khi nhiều người làm việc

### 4. Documentation
- Thêm comments ở đầu mỗi file
- Giải thích relations phức tạp
- Document business rules

---

## 🚨 Troubleshooting

### Lỗi: "Schema files not found"
- Kiểm tra đường dẫn trong `package.json` hoặc `prisma.config.ts`
- Đảm bảo tất cả files có extension `.prisma`

### Lỗi: "Duplicate model/enum"
- Kiểm tra xem có model/enum nào bị định nghĩa 2 lần không
- Dùng `prisma validate` để tìm lỗi

### Lỗi: "Relation not found"
- Đảm bảo cả 2 models trong relation đều được định nghĩa
- Kiểm tra tên model có đúng không

### Lỗi: "Generator/Datasource must be in one file"
- Đảm bảo `generator` và `datasource` chỉ có trong file `_base.prisma`

---

## 📚 Tài Liệu Tham Khảo

- [Prisma Multi-File Schema Docs](https://www.prisma.io/docs/orm/prisma-schema-file/organizing-schema-files)
- [Prisma Blog: Multi-File Support](https://www.prisma.io/blog/organize-your-prisma-schema-with-multi-file-support)

---

## 💡 Kết Luận

**Cho dự án hiện tại:**
- ✅ Chưa cần chia nhỏ ngay (chỉ 3 models)
- ✅ Có thể giữ nguyên single file
- ✅ Khi dự án phát triển (10+ models), nên refactor sang multi-file

**Lợi ích khi chia nhỏ:**
- 📁 Tổ chức code tốt hơn
- 👥 Dễ làm việc nhóm
- 🔍 Dễ tìm và maintain
- 📝 Dễ document từng module

**Nhược điểm:**
- ⚠️ Phức tạp hơn cho dự án nhỏ
- ⚠️ Cần cấu hình thêm
- ⚠️ Có thể gây confusion nếu không tổ chức tốt

---

**Chúc bạn code vui vẻ! 🚀**

