# --- Stage 1: Builder ---
    FROM node:22-alpine AS builder
    WORKDIR /app
    COPY package.json yarn.lock* ./
    RUN yarn install --non-interactive --ignore-engines
    
    COPY . .
    
    # Đảm bảo Prisma generate vào thư mục mặc định hoặc custom output
    RUN node scripts/merge-prisma-schema.js || echo "Merge skipped"
    RUN yarn prisma generate
    
    RUN yarn build
    
    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    WORKDIR /app
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines
    
    # 1. Copy file build
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    
    # 2. CÁCH SỬA LỖI COPY: Kiểm tra và copy Prisma Client
    # Thay vì trỏ đích danh /app/node_modules/.prisma, ta dùng dấu sao hoặc copy thư mục generated
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
    # Nếu bạn có custom output trong schema.prisma là "../generated", hãy giữ dòng này:
    COPY --from=builder /app/generated* ./generated/
    
    # 3. Lệnh dự phòng nếu .prisma vẫn nằm trong node_modules
    # Dùng || true để nếu không có thư mục này thì build vẫn tiếp tục không bị văng lỗi
    RUN mkdir -p node_modules/.prisma
    COPY --from=builder /app/node_modules/.prisma* ./node_modules/.prisma/
    
    EXPOSE 3104
    CMD ["node", "dist/main.js"]