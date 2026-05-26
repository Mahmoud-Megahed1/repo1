import { execSync } from 'child_process';

try {
  console.log("=== PM2 LOGS FOR BACKEND ===");
  const output = execSync('pm2 logs backend --lines 50 --nostream', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error("Error reading pm2 logs:", e.message);
}
