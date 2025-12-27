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
    
    # --- GIẢI PHÁP CHO LỖI BIẾN MÔI TRƯỜNG LÚC BUILD ---
    # Khai báo ARG để lấy giá trị từ tab Variables của Railway truyền vào lúc build
    ARG DATABASE_URL
    # Generate Prisma Client (không dùng --no-engine để tránh lỗi version)
    RUN DATABASE_URL=$DATABASE_URL npx prisma generate
    # --------------------------------------------------
    
    # Build dự án NestJS ra thư mục dist
    RUN yarn build
    
    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    
    RUN apk add --no-cache openssl
    WORKDIR /app
    
    # Chỉ cài đặt dependencies cần thiết cho runtime
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines
    
    # 1. Copy các file thực thi đã build
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    # 2. Copy thư mục generated/prisma (Custom output của bạn)
    COPY --from=builder /app/generated ./generated
    
    # 3. Copy thư viện @prisma cần thiết
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    
    # Thiết lập biến môi trường chạy
    ENV NODE_ENV=production
    
    # Cổng mặc định mà App sẽ lắng nghe
    EXPOSE 3104
    
    # Lệnh khởi chạy: Tự động chạy migrate và khởi động server
    # Railway sẽ tự động bơm DATABASE_URL vào môi trường lúc chạy (Runtime)
    CMD npx prisma migrate deploy && node dist/main.js