import { execSync } from 'child_process';
try {
  const output = execSync('pm2 describe 14', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error(e.message);
}
