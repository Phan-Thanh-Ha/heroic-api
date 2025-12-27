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
    # Khai báo ARG: Railway sẽ tự động truyền DATABASE_URL từ tab Variables vào đây lúc BUILD
    ARG DATABASE_URL
    
    # Chạy Prisma generate. 
    # Bỏ --no-engine vì phiên bản Prisma của bạn báo lỗi "unknown option"
    RUN DATABASE_URL=$DATABASE_URL npx prisma generate
    # ----------------------------------------
    
    # Build dự án NestJS ra thư mục dist
    RUN yarn build
    
    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    
    RUN apk add --no-cache openssl
    WORKDIR /app
    
    # Chỉ cài đặt dependencies cần thiết cho runtime (giúp image nhẹ hơn)
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines
    
    # 1. Copy các file thực thi và cấu hình đã build từ Stage 1
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    # 2. Copy thư mục generated/prisma (Nơi chứa Prisma Client đã tạo)
    COPY --from=builder /app/generated ./generated
    
    # 3. Copy các thư viện Prisma cần thiết
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Thiết lập biến môi trường
    ENV NODE_ENV=production
    
    # Khớp với cổng bạn đã cấu hình (Mặc định 3104)
    EXPOSE 3104
    
    # Lệnh khởi chạy: Tự động chạy migrate database và khởi động server
    # Railway sẽ cung cấp biến PORT cho quá trình chạy
    CMD npx prisma migrate deploy && node dist/main.js