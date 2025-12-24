#!/usr/bin/env node

/**
 * Script để tự động sync Prisma: merge, generate, push và mở Prisma Studio
 * 
 * Cách dùng:
 * - npm run prisma:sync:studio
 * - Hoặc chạy: node scripts/sync-prisma-studio.js
 */

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
// HÀM CHẠY COMMAND
// ============================================
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 ${description}...`);
    exec(command, { cwd: PROJECT_ROOT }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Lỗi: ${error.message}`);
        if (stderr) console.error(stderr);
        reject(error);
        return;
      }
      if (stdout) console.log(stdout);
      console.log(`✅ ${description} thành công!`);
      resolve(stdout);
    });
  });
}

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
    console.log(`\n🚀 Đang khởi động Prisma Studio trên port ${PRISMA_STUDIO_PORT}...\n`);
    
    const prismaStudioProcess = spawn(
      'npx',
      ['prisma', 'studio', '--port', PRISMA_STUDIO_PORT.toString(), '--browser', 'none'],
      {
        stdio: 'inherit',
        shell: true,
        cwd: PROJECT_ROOT
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
}

// ============================================
// MAIN FUNCTION
// ============================================
async function main() {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 Bắt đầu sync Prisma và mở Studio');
    console.log('═══════════════════════════════════════════════════════');

    // Bước 1: Merge Prisma schema
    await runCommand('npm run prisma:merge', 'Bước 1/4: Merge Prisma schema files');

    // Bước 2: Generate Prisma Client
    await runCommand('npm run prisma:generate', 'Bước 2/4: Generate Prisma Client');

    // Bước 3: Push schema lên database
    await runCommand('npx prisma db push', 'Bước 3/4: Push schema lên database');

    // Bước 4: Kiểm tra và khởi động Prisma Studio
    console.log('\n🔄 Bước 4/4: Kiểm tra Prisma Studio...');
    const studioRunning = await checkPrismaStudioRunning();
    
    if (studioRunning) {
      console.log(`✅ Prisma Studio đã đang chạy trên port ${PRISMA_STUDIO_PORT}\n`);
      logPrismaStudioUrls(PRISMA_STUDIO_PORT);
      console.log('💡 Prisma Studio đã được đồng bộ với schema mới nhất!');
    } else {
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
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ Hoàn thành! Prisma đã được sync và Studio đã sẵn sàng');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error(`\n❌ Lỗi trong quá trình sync: ${error.message}`);
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

