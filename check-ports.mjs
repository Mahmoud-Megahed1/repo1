import { execSync } from 'child_process';

const apps = ['englishom-app', 'englishom-blog', 'englishom-dashboard', 'englishom-level-test', 'englishom-ques', 'englishom-admin', 'the-a1-code'];

for (const app of apps) {
  try {
    const output = execSync(`pm2 logs ${app} --lines 50 --nostream`, { encoding: 'utf-8' });
    const match = output.match(/Server running on http:\/\/localhost:(\d+)\//);
    if (match) {
      console.log(`[${app}] is running on port ${match[1]}`);
    } else {
      console.log(`[${app}] port not found in logs.`);
    }
  } catch (e) {}
}
