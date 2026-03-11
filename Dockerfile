FROM node:20-alpine AS builder

# 1. Cài đặt full công cụ cần thiết cho Prisma và biên dịch C++
RUN apk add --no-cache openssl libc6-compat python3 make g++

WORKDIR /app

# 2. Copy package.json
COPY package.json ./

# 3. Cài đặt với flag an toàn nhất
RUN npm install --legacy-peer-deps --network-timeout=100000 --prefer-offline --no-audit --no-fund
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 2: Production ---
FROM node:20-alpine AS production
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# Copy từ builder sang
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3104

CMD ["node", "dist/main.js"]