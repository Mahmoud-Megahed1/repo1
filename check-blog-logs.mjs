import { execSync } from 'child_process';
try {
  console.log("=== englishom-blog LOGS ===");
  console.log(execSync('pm2 logs englishom-blog --lines 50 --nostream', { encoding: 'utf-8' }));
} catch (e) {
  console.error(e.message);
}
