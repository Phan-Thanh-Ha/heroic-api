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
    
    # --- GIẢI PHÁP CHO LỖI BIẾN MÔI TRƯỜNG ---
    ARG DATABASE_URL
    # Generate Prisma Client vào thư mục /app/generated/prisma
    RUN DATABASE_URL=$DATABASE_URL npx prisma generate
    # ----------------------------------------
    
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
    
    # 2. COPY QUAN TRỌNG: Vì bạn dùng custom output, mọi thứ nằm ở đây
    # Thư mục này chứa Prisma Client đã được generate hoàn chỉnh
    COPY --from=builder /app/generated ./generated
    
    # 3. Copy thư viện @prisma (chứa engine và các file phụ trợ)
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    
    # --- LƯU Ý: Đã bỏ dòng copy node_modules/.prisma vì nó không tồn tại khi dùng custom output ---
    
    # Thiết lập biến môi trường chạy
    ENV NODE_ENV=production
    
    # Cổng mặc định
    EXPOSE 3104
    
    # Lệnh khởi chạy: Migrate database trước khi start server
    CMD npx prisma migrate deploy && node dist/main.js