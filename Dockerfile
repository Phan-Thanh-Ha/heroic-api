# Build stage
FROM node:20-alpine AS builder

# Kiểm tra và cài yarn nếu chưa có (node:20-alpine có thể đã có yarn)
RUN yarn --version || npm install -g yarn --force

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies (bao gồm devDependencies để có prisma CLI)
RUN yarn install --frozen-lockfile

# Copy source code và scripts
COPY . .

# Debug: Kiểm tra các file cần thiết
RUN echo "🔍 Checking files..." && \
    ls -la scripts/ && \
    ls -la prisma/ && \
    echo "✅ Files checked"

# Merge Prisma schema và Generate Prisma Client
# Set DATABASE_URL giả để Prisma có thể generate client (không cần kết nối thật)
RUN echo "🔄 Starting Prisma merge..." && \
    yarn prisma:merge && \
    echo "✅ Prisma merge completed" && \
    echo "🔄 Generating Prisma Client..." && \
    DATABASE_URL="postgresql://user:password@localhost:5432/dbname" yarn prisma:generate && \
    echo "✅ Prisma Client generated"

# Build application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

# Kiểm tra và cài yarn nếu chưa có
RUN yarn --version || npm install -g yarn --force

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port (default NestJS port, adjust if needed)
EXPOSE 3103

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3103/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/main.js"]

