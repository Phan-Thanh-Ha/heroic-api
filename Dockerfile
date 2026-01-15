# --- Stage 1: Builder ---
    FROM node:22-alpine AS builder
    RUN apk add --no-cache openssl
    WORKDIR /app
    COPY package.json yarn.lock* ./
    RUN yarn install --non-interactive --ignore-engines
    COPY . .

    # Render sẽ tự động đưa file Secret .env vào thư mục /app lúc build
    # Prisma sẽ tự đọc file này để lấy DATABASE_URL
    RUN npx prisma generate
    RUN yarn build

    # --- Stage 2: Production ---
    FROM node:22-alpine AS production
    RUN apk add --no-cache openssl
    WORKDIR /app
    COPY package.json yarn.lock* ./
    RUN yarn install --production --non-interactive --ignore-engines

    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/generated ./generated
    COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

    ENV NODE_ENV=production
    EXPOSE 3104

    # Chạy server NestJS
    CMD ["node", "dist/main.js"]