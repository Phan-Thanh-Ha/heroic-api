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
    
    # Xử lý gộp schema (nếu có) và generate Prisma Client
    RUN node scripts/merge-prisma-schema.js || echo "Merge skipped"
    
    # Cập nhật binaryTargets trong quá trình build để tương thích Linux Alpine
    RUN npx prisma generate
    
    # Build dự án NestJS ra thư mục dist
    RUN yarn build
    
    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    
    RUN apk add --no-cache openssl
    WORKDIR /app
    
    # Chỉ cài đặt dependencies cần thiết cho runtime
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines
    
    # 1. Copy các file thực thi và cấu hình
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    # 2. COPY QUAN TRỌNG: Copy thư mục generated/prisma mà bạn đã định nghĩa
    # Vì bạn để output = "../generated/prisma", Prisma Client nằm ở đây
    COPY --from=builder /app/generated ./generated
    
    # 3. Copy các thư viện Prisma cần thiết trong node_modules
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
    
    # Thiết lập biến môi trường
    ENV NODE_ENV=production
    EXPOSE 3104
    
    # Lệnh khởi chạy: Migrate database trước khi start server
    CMD npx prisma migrate deploy && node dist/main.js