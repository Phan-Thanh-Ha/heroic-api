import os from 'os';

/**
 * Get local IP addresses
 * (Giữ nguyên hàm này của bạn)
 */
export const getLocalIps = (): string[] => {
  const ifaces = os.networkInterfaces();
  return Object.values(ifaces)
    .flat()
    .filter((i) => i && !i.internal && i.family === 'IPv4')
    .map((i) => i!.address);
};

/**
 * Log local and LAN URLs for Swagger docs (Updated)
 * @param port Port của ứng dụng
 * @param docPath Đường dẫn docs (ví dụ: '/docs')
 */
export const logSwaggerUrls = (port: number, docPath: string) => {
  const localIps = getLocalIps();
  const baseUrl = `http://localhost:${port}`;

  console.log(`\n📖 Swagger Documentation:`);
  
  // 1. Log Localhost
  console.log(`   Local:    ${baseUrl}${docPath}`);

  // 2. Log LAN IPs nếu có
  if (localIps.length > 0) {
    console.log(`   LAN IPs:  ${localIps.join(', ')}`);
    
    localIps.forEach((ip) => {
      const lanBaseUrl = `http://${ip}:${port}`;
      console.log(`   LAN Base: ${lanBaseUrl}`);
      console.log(`   LAN Docs: ${lanBaseUrl}${docPath}`);
    });
  }
  console.log('');
};