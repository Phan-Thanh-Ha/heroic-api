# --- Stage 1: Builder ---
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate
RUN npm run build

# --- Stage 2: Production ---
FROM node:22-alpine AS production
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
# Quan trọng: Prisma cần biến này để chạy trên Alpine
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/prisma/libquery_engine-linux-musl-openssl-3.0.x.so.node

EXPOSE 3104

CMD ["node", "dist/main.js"]