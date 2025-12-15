import os from 'os';

/**
 * Log local and LAN URLs for Swagger docs
 */
export const logSwaggerUrls = (port: number, paths: { admin: string; customer: string }) => {
  const ifaces = os.networkInterfaces();
  const localIps = Object.values(ifaces)
    .flat()
    .filter((i) => i && !i.internal && i.family === 'IPv4')
    .map((i) => i!.address);

  const baseUrl = `http://localhost:${port}`;
  const lanUrls = localIps.map((ip) => `http://${ip}:${port}`);

  console.log(`\n📖 Swagger Documentation:`);
  if (localIps.length > 0) {
    console.log(`   LAN IPs: ${localIps.join(', ')}`);
    lanUrls.forEach((url) => {
      console.log(`   LAN Base:    ${url}`);
    });
  }
  console.log(`   Admin:   ${baseUrl}${paths.admin}`);
  console.log(`   Customer: ${baseUrl}${paths.customer}`);
  lanUrls.forEach((url) => {
    console.log(`   LAN Admin:   ${url}${paths.admin}`);
    console.log(`   LAN Customer: ${url}${paths.customer}`);
  });
  console.log('');
};

