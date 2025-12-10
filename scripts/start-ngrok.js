#!/usr/bin/env node

const { exec } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ============================================
// CẤU HÌNH
// ============================================
const PROJECT_ROOT = path.join(__dirname, '..');

// Load env file để lấy authtoken (ưu tiên .env.development, sau đó .env)
const ENV_DEV_FILE = path.join(PROJECT_ROOT, '.env.development');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');

if (fs.existsSync(ENV_DEV_FILE)) {
  require('dotenv').config({ path: ENV_DEV_FILE });
} else if (fs.existsSync(ENV_FILE)) {
  require('dotenv').config({ path: ENV_FILE });
}

const PORT = process.env.PORT || 3102;
const NGROK_PORT = process.env.NGROK_PORT || PORT;
const NGROK_API_URL = 'http://127.0.0.1:4040/api/tunnels';
const MAX_RETRY_COUNT = 30; // Thử tối đa 30 lần (30 giây)
const RETRY_INTERVAL = 1000; // Mỗi 1 giây thử lại

// Đọc authtoken từ .env
const NGROK_AUTHTOKEN = process.env.NGROK_AUTHTOKEN || null;

// Đường dẫn file
const NGROK_URL_FILE = path.join(PROJECT_ROOT, '.ngrok-url');
const NGROK_CONFIG_FILE = path.join(PROJECT_ROOT, 'ngrok.yml');

// ============================================
// HÀM LẤY NGROK URL TỪ API
// ============================================
function getNgrokUrlFromAPI() {
  return new Promise((resolve, reject) => {
    http.get(NGROK_API_URL, (response) => {
      let data = '';
      
      // Đọc dữ liệu từ response
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // Khi đọc xong, parse JSON
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          // Tìm tunnel HTTPS (ưu tiên) hoặc tunnel đầu tiên
          if (result.tunnels && result.tunnels.length > 0) {
            const httpsTunnel = result.tunnels.find(t => t.proto === 'https');
            const tunnel = httpsTunnel || result.tunnels[0];
            resolve(tunnel.public_url);
          } else {
            reject(new Error('Không tìm thấy tunnel nào'));
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// ============================================
// HÀM LƯU URL VÀO FILE (CHỈ LƯU TẠM)
// ============================================
function saveNgrokUrl(url) {
  // Chỉ lưu vào file .ngrok-url để có thể đọc nếu cần
  fs.writeFileSync(NGROK_URL_FILE, url);
}

// ============================================
// HÀM HIỂN THỊ THÔNG TIN URL
// ============================================
function displayNgrokInfo(url) {
  console.log('\n✅ Ngrok tunnel đã được tạo thành công!');
  console.log(`🌐 Public URL: ${url}`);
  console.log(`📖 Swagger Admin: ${url}/docs-admin`);
  console.log(`📖 Swagger Website: ${url}/docs-website`);
}

// ============================================
// HÀM THỬ LẤY URL (RETRY LOGIC)
// ============================================
let retryCount = 0;
let checkInterval = null;
let ngrokProcess = null;

// ============================================
// HÀM DỌN DẸP KHI THOÁT
// ============================================
function cleanup() {
  // Dừng interval check
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  
  // Kill ngrok process
  if (ngrokProcess) {
    ngrokProcess.kill();
  }
  
  // Xóa file .ngrok-url
  if (fs.existsSync(NGROK_URL_FILE)) {
    fs.unlinkSync(NGROK_URL_FILE);
  }
}

function tryGetNgrokUrl() {
  retryCount++;
  
  getNgrokUrlFromAPI()
    .then((url) => {
      // Thành công: dừng retry và hiển thị thông tin
      clearInterval(checkInterval);
      displayNgrokInfo(url);
      saveNgrokUrl(url);
    })
    .catch(() => {
      // Thất bại: tiếp tục thử lại hoặc báo lỗi
      if (retryCount >= MAX_RETRY_COUNT) {
        clearInterval(checkInterval);
        console.error(`\n❌ Không thể lấy ngrok URL sau ${MAX_RETRY_COUNT} lần thử`);
        console.log(`💡 Hãy đảm bảo ngrok đang chạy và kiểm tra: http://127.0.0.1:4040\n`);
        cleanup();
        process.exit(1);
      }
    });
}

// ============================================
// HÀM SET NGROK AUTHTOKEN TỪ ENV
// ============================================
function setNgrokAuthtoken() {
  if (!NGROK_AUTHTOKEN) {
    console.log(`⚠️  Chưa có NGROK_AUTHTOKEN trong .env`);
    console.log(`💡 Thêm vào .env: NGROK_AUTHTOKEN=your-token`);
    console.log(`   Lấy token từ: https://dashboard.ngrok.com/get-started/your-authtoken\n`);
    return false;
  }
  
  // Set authtoken vào ngrok config (chỉ set 1 lần, lưu vào ~/.config/ngrok/ngrok.yml)
  // Ngrok v3 tự động lưu vào global config
  const { execSync } = require('child_process');
  try {
    execSync(`ngrok config add-authtoken ${NGROK_AUTHTOKEN}`, { stdio: 'pipe' });
    console.log(`✅ Đã set authtoken từ .env\n`);
    return true;
  } catch (error) {
    // Có thể đã set rồi hoặc có lỗi, thử tiếp tục
    console.log(`⚠️  Không thể set authtoken, có thể đã được set trước đó\n`);
    return true;
  }
}

// ============================================
// HÀM KIỂM TRA SERVER ĐANG CHẠY
// ============================================
function checkServerRunning() {
  return new Promise((resolve) => {
    http.get(`http://localhost:${NGROK_PORT}`, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// ============================================
// HÀM START SERVER
// ============================================
function startServer() {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Đang khởi động server trên port ${NGROK_PORT}...`);
    
    const serverProcess = exec('npm run start:dev', (error) => {
      if (error) {
        reject(error);
      }
    });
    
    // Đợi server khởi động (tối đa 30 giây)
    let checkCount = 0;
    const maxChecks = 30;
    
    const checkInterval = setInterval(async () => {
      checkCount++;
      const isRunning = await checkServerRunning();
      
      if (isRunning) {
        clearInterval(checkInterval);
        console.log(`✅ Server đã khởi động thành công!\n`);
        resolve(serverProcess);
      } else if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        reject(new Error('Server không khởi động được sau 30 giây'));
      }
    }, 1000);
  });
}

// ============================================
// BẮT ĐẦU CHẠY
// ============================================
async function main() {
  // Kiểm tra server đã chạy chưa
  const serverRunning = await checkServerRunning();
  
  if (!serverRunning) {
    console.log(`⚠️  Server chưa chạy, đang tự động khởi động...\n`);
    try {
      await startServer();
    } catch (error) {
      console.error(`❌ Không thể khởi động server: ${error.message}`);
      console.log(`💡 Hãy chạy 'npm run start:dev' trong terminal khác trước\n`);
      process.exit(1);
    }
  } else {
    console.log(`✅ Server đã đang chạy trên port ${NGROK_PORT}\n`);
  }
  
  // Set authtoken từ env trước khi start ngrok
  if (!NGROK_AUTHTOKEN) {
    console.log(`❌ Cần NGROK_AUTHTOKEN trong file .env`);
    console.log(`💡 Thêm vào .env: NGROK_AUTHTOKEN=your-token`);
    console.log(`   Lấy token từ: https://dashboard.ngrok.com/get-started/your-authtoken\n`);
    process.exit(1);
  }
  
  setNgrokAuthtoken();
  
  console.log(`🚀 Đang khởi động ngrok tunnel trên port ${NGROK_PORT}...\n`);

  // Tạo lệnh ngrok
  // Nếu có file ngrok.yml, sử dụng config file đó
  let ngrokCommand = `ngrok http ${NGROK_PORT}`;
  if (fs.existsSync(NGROK_CONFIG_FILE)) {
    ngrokCommand = `ngrok http --config=${NGROK_CONFIG_FILE} ${NGROK_PORT}`;
    console.log(`📄 Sử dụng config file: ngrok.yml`);
  }
  console.log('');

  // Chạy lệnh ngrok
  ngrokProcess = exec(ngrokCommand, (error) => {
    if (error) {
      console.error(`❌ Lỗi khi khởi động ngrok: ${error.message}`);
      process.exit(1);
    }
  });

  // Đợi ngrok khởi động xong rồi bắt đầu lấy URL
  setTimeout(() => {
    console.log('⏳ Đang chờ ngrok khởi động...');
    checkInterval = setInterval(tryGetNgrokUrl, RETRY_INTERVAL);
  }, 2000);
}

// Chạy main function
main().catch((error) => {
  console.error(`❌ Lỗi: ${error.message}`);
  process.exit(1);
});

// ============================================
// XỬ LÝ SIGNAL KHI THOÁT (Ctrl+C)
// ============================================
process.on('SIGINT', () => {
  console.log('\n🛑 Đang dừng ngrok...');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});

