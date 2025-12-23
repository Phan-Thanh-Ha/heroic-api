# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy .env file first (for DATABASE_URL during build)
COPY .env.development ./

# Copy source code
COPY . .

# Merge Prisma schemas (allow merge to fail if schema is already merged)
RUN node scripts/merge-prisma-schema.js || echo "Merge skipped (schema may already be merged)"

# Generate Prisma client (load DATABASE_URL from .env.development)
RUN set -a && . .env.development && set +a && yarn prisma:generate

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3103

# Start the application
CMD ["node", "dist/main.js"]

