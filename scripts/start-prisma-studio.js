#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ============================================
// CẤU HÌNH
// ============================================
const PROJECT_ROOT = path.join(__dirname, '..');

// Load env file (ưu tiên .env.development, sau đó .env)
const ENV_DEV_FILE = path.join(PROJECT_ROOT, '.env.development');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');

if (fs.existsSync(ENV_DEV_FILE)) {
  require('dotenv').config({ path: ENV_DEV_FILE });
} else if (fs.existsSync(ENV_FILE)) {
  require('dotenv').config({ path: ENV_FILE });
}

const PRISMA_STUDIO_PORT = process.env.PRISMA_STUDIO_PORT || 51212;

// ============================================
// HÀM LẤY LOCAL IPs
// ============================================
function getLocalIps() {
  const ifaces = os.networkInterfaces();
  return Object.values(ifaces)
    .flat()
    .filter((i) => i && !i.internal && i.family === 'IPv4')
    .map((i) => i.address);
}

// ============================================
// HÀM HIỂN THỊ URLs
// ============================================
function logPrismaStudioUrls(port) {
  const localIps = getLocalIps();
  const baseUrl = `http://localhost:${port}`;
  const lanUrls = localIps.map((ip) => `http://${ip}:${port}`);

  console.log(`\n📊 Prisma Studio URLs:`);
  console.log(`   Localhost: ${baseUrl}`);
  if (localIps.length > 0) {
    console.log(`   LAN IPs: ${localIps.join(', ')}`);
    lanUrls.forEach((url) => {
      console.log(`   LAN:     ${url}`);
    });
  }
  console.log('');
}

// ============================================
// HÀM KIỂM TRA PRISMA STUDIO ĐANG CHẠY
// ============================================
function checkPrismaStudioRunning() {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PRISMA_STUDIO_PORT}`, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// ============================================
// HÀM START PRISMA STUDIO
// ============================================
function startPrismaStudio() {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Đang khởi động Prisma Studio trên port ${PRISMA_STUDIO_PORT}...\n`);
    
    // Chạy prisma:merge trước
    exec('npm run prisma:merge', (error) => {
      if (error) {
        console.error(`❌ Lỗi khi merge Prisma schema: ${error.message}`);
        reject(error);
        return;
      }
      
      // Sau khi merge xong, chạy Prisma Studio
      const prismaStudioProcess = spawn(
        'npx',
        ['prisma', 'studio', '--port', PRISMA_STUDIO_PORT.toString(), '--browser', 'none'],
        {
          stdio: 'inherit',
          shell: true
        }
      );
      
      // Đợi Prisma Studio khởi động (tối đa 30 giây)
      let checkCount = 0;
      const maxChecks = 30;
      
      const checkInterval = setInterval(async () => {
        checkCount++;
        const isRunning = await checkPrismaStudioRunning();
        
        if (isRunning) {
          clearInterval(checkInterval);
          logPrismaStudioUrls(PRISMA_STUDIO_PORT);
          resolve(prismaStudioProcess);
        } else if (checkCount >= maxChecks) {
          clearInterval(checkInterval);
          reject(new Error('Prisma Studio không khởi động được sau 30 giây'));
        }
      }, 1000);
      
      // Xử lý khi process thoát
      prismaStudioProcess.on('exit', (code) => {
        clearInterval(checkInterval);
        if (code !== 0 && code !== null) {
          reject(new Error(`Prisma Studio exited with code ${code}`));
        }
      });
      
      // Xử lý lỗi
      prismaStudioProcess.on('error', (error) => {
        clearInterval(checkInterval);
        reject(error);
      });
    });
  });
}

// ============================================
// BẮT ĐẦU CHẠY
// ============================================
async function main() {
  // Kiểm tra Prisma Studio đã chạy chưa
  const studioRunning = await checkPrismaStudioRunning();
  
  if (studioRunning) {
    console.log(`✅ Prisma Studio đã đang chạy trên port ${PRISMA_STUDIO_PORT}\n`);
    logPrismaStudioUrls(PRISMA_STUDIO_PORT);
    return;
  }
  
  try {
    const process = await startPrismaStudio();
    
    // Giữ process chạy
    process.on('exit', () => {
      console.log('\n🛑 Prisma Studio đã dừng');
    });
    
    // Xử lý khi nhận signal dừng
    process.on('SIGINT', () => {
      console.log('\n🛑 Đang dừng Prisma Studio...');
      process.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`❌ Không thể khởi động Prisma Studio: ${error.message}`);
    process.exit(1);
  }
}

// Chạy main function
main().catch((error) => {
  console.error(`❌ Lỗi: ${error.message}`);
  process.exit(1);
});

// Xử lý signal khi thoát (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 Đang dừng...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

