# Prisma Multi-File Schema Guide

## 📋 Tổng quan

Prisma không hỗ trợ natively multi-file schema, nhưng chúng ta có thể tách nhỏ schema thành nhiều file và tự động merge chúng lại trước khi generate client.

## 📁 Cấu trúc thư mục

```
prisma/
├── schema.prisma          # File chính (chỉ chứa generator + datasource)
├── locations/
│   ├── province.prisma    # Model Province
│   ├── district.prisma    # Model District
│   └── ward.prisma        # Model Ward
├── users/
│   └── user.prisma        # Model User
└── products/
    └── product.prisma     # Model Product
```

## 🚀 Cách sử dụng

### 1. Tạo file schema mới

Tạo file `.prisma` trong thư mục module tương ứng:

```prisma
// prisma/users/user.prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  
  @@map("users")
}
```

**Lưu ý:** 
- ❌ KHÔNG thêm `generator` hoặc `datasource` vào file con
- ✅ Chỉ viết model và các directive

### 2. Merge và Generate

```bash
# Merge các file schema
npm run prisma:merge

# Hoặc merge + generate cùng lúc
npm run prisma:generate

# Hoặc merge + migrate
npm run prisma:migrate
```

### 3. Scripts có sẵn

| Script | Mô tả |
|--------|-------|
| `npm run prisma:merge` | Chỉ merge các file schema |
| `npm run prisma:generate` | Merge + Generate Prisma client |
| `npm run prisma:migrate` | Merge + Tạo migration |
| `npm run prisma:studio` | Merge + Mở Prisma Studio |

## ⚙️ Cách hoạt động

1. Script `merge-prisma-schema.js` sẽ:
   - Đọc file `schema.prisma` chính (lấy generator + datasource)
   - Tìm tất cả file `.prisma` trong `prisma/**/*.prisma` (trừ `schema.prisma`)
   - Merge tất cả models vào `schema.prisma`
   - Loại bỏ generator/datasource trùng lặp từ file con

2. Sau khi merge, Prisma sẽ generate client từ file `schema.prisma` đã được merge

## 📝 Best Practices

### 1. Tổ chức theo module

```
prisma/
├── schema.prisma
├── locations/     # Module địa điểm
├── users/         # Module người dùng
├── products/      # Module sản phẩm
└── orders/        # Module đơn hàng
```

### 2. Đặt tên file rõ ràng

- ✅ `user.prisma` - Model User
- ✅ `user-profile.prisma` - Model UserProfile
- ❌ `model1.prisma` - Không rõ ràng

### 3. Thêm comment trong file

```prisma
// ============================================
// USERS MODULE - User
// ============================================

model User {
  // ...
}
```

### 4. Quản lý relations

Nếu model có relation với model khác module, đảm bảo cả 2 model đều được define:

```prisma
// prisma/users/user.prisma
model User {
  id      Int     @id
  orders  Order[] // Relation với Order
}

// prisma/orders/order.prisma
model Order {
  id      Int   @id
  user_id Int
  user    User  @relation(fields: [user_id], references: [id])
}
```

## 🔧 Troubleshooting

### Lỗi: "Model X not found"

- ✅ Chạy `npm run prisma:merge` trước khi generate
- ✅ Kiểm tra file `.prisma` có đúng định dạng không
- ✅ Kiểm tra model có được include trong merge không

### Lỗi: "Duplicate generator/datasource"

- ✅ Đảm bảo chỉ có 1 `generator` và 1 `datasource` trong `schema.prisma` chính
- ✅ Không thêm generator/datasource vào file con

### Schema quá lớn sau khi merge

- ✅ Đây là bình thường, Prisma cần 1 file duy nhất để generate
- ✅ File `schema.prisma` sau merge sẽ lớn nhưng không ảnh hưởng performance

## 📚 Tài liệu tham khảo

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Multi-File Schema (Community Solution)](https://github.com/prisma/prisma/discussions)
