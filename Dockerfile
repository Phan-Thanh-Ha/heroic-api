# --- Stage 1: Builder ---
    FROM node:22-alpine AS builder

    # Cài đặt openssl vì Prisma engine cần nó để chạy trên Alpine
    RUN apk add --no-cache openssl
    
    WORKDIR /app
    
    # Tận dụng Docker cache cho dependencies
    COPY package.json yarn.lock* ./
    RUN yarn install --non-interactive --ignore-engines
    
    # Copy toàn bộ mã nguồn
    COPY . .
    
    # Xử lý gộp schema (nếu có)
    RUN node scripts/merge-prisma-schema.js || echo "Merge skipped"
    
    # --- KHU VỰC QUAN TRỌNG ĐỂ SỬA LỖI ---
    # Khai báo ARG: Railway sẽ tự động truyền giá trị từ tab Variables vào đây lúc BUILD
    ARG DATABASE_URL
    
    # Chạy Prisma generate với biến đã được nạp
    RUN DATABASE_URL=$DATABASE_URL npx prisma generate --no-engine
    # -------------------------------------
    
    # Build dự án NestJS ra thư mục dist
    RUN yarn build
    
    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    
    RUN apk add --no-cache openssl
    WORKDIR /app
    
    # Chỉ cài đặt dependencies cần thiết cho runtime (giúp image nhẹ hơn)
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines
    
    # 1. Copy các file thực thi và cấu hình
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    # 2. Copy thư mục generated/prisma (Custom output của bạn)
    COPY --from=builder /app/generated ./generated
    
    # 3. Copy các thư viện Prisma lõi
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Thiết lập biến môi trường chạy
    ENV NODE_ENV=production
    
    # Khớp với cổng bạn đã cấu hình trên Railway (mặc định nên là 3104 hoặc dùng biến PORT)
    EXPOSE 3104
    
    # Lệnh khởi chạy: Migrate database trước khi start server
    # Sử dụng biến PORT của Railway để linh hoạt
    CMD npx prisma migrate deploy && node dist/main.js