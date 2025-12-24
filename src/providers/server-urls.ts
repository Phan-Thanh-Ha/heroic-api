import os from 'os';

/**
 * Get local IP addresses
 */
export const getLocalIps = (): string[] => {
  const ifaces = os.networkInterfaces();
  return Object.values(ifaces)
    .flat()
    .filter((i) => i && !i.internal && i.family === 'IPv4')
    .map((i) => i!.address);
};

/**
 * Log local and LAN URLs for Swagger docs
 */
export const logSwaggerUrls = (
  port: number,
  paths: { admin?: string; customer?: string; docs?: string },
) => {
  const localIps = getLocalIps();
  const baseUrl = `http://localhost:${port}`;
  const lanUrls = localIps.map((ip) => `http://${ip}:${port}`);

  console.log(`\n📖 Swagger Documentation:`);
  if (localIps.length > 0) {
    console.log(`   LAN IPs: ${localIps.join(', ')}`);
  }

  // Hiển thị docs chính (có dropdown chọn definition)
  if (paths.docs) {
    console.log(`   Docs (Main): ${baseUrl}${paths.docs}`);
    lanUrls.forEach((url) => {
      console.log(`   LAN Docs: ${url}${paths.docs}`);
    });
  }
  
  // Hiển thị các definitions riêng lẻ
  if (paths.admin) {
    console.log(`   Admin:   ${baseUrl}${paths.admin}`);
    lanUrls.forEach((url) => {
      console.log(`   LAN Admin: ${url}${paths.admin}`);
    });
  }
  if (paths.customer) {
    console.log(`   Customer: ${baseUrl}${paths.customer}`);
    lanUrls.forEach((url) => {
      console.log(`   LAN Customer: ${url}${paths.customer}`);
    });
  }
  console.log('');
};

/**
 * Log local and LAN URLs for Prisma Studio
 */
export const logPrismaStudioUrls = (port: number) => {
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
};

