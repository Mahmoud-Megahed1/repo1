import { execSync } from 'child_process';
try {
  console.log("=== englishom-ques LOGS ===");
  console.log(execSync('pm2 logs englishom-ques --lines 50 --nostream', { encoding: 'utf-8' }));
} catch (e) {
  console.error(e.message);
}
