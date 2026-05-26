import { execSync } from 'child_process';
try {
  console.log("=== Pinging 3003 directly ===");
  const output = execSync('curl -X POST "http://127.0.0.1:3003/api/trpc/auth.adminLogin?batch=1" -H "Content-Type: application/json" -d \'{"0":{"email":"superadmin@englishom.com","password":"wrong"}}\' -s', { encoding: 'utf-8' });
  console.log("Result:", output);
  
  console.log("=== Checking PM2 logs for HTTP Request ===");
  const logs = execSync('pm2 logs englishom-ques --lines 20 --nostream', { encoding: 'utf-8' });
  console.log(logs);
} catch (e) {
  console.error(e.message);
}
