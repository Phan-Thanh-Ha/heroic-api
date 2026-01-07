import { defineConfig, env } from 'prisma/config';
// Import và sử dụng function loadEnv từ config của project
import { loadEnv } from './src/config/app/config.env';

// Load environment variables
loadEnv();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})