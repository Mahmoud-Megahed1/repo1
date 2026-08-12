const fs = require('fs');

console.log('\n--- Searching Nginx Access Logs for "/files" at 17:50-17:55 ---');
const accessLogPath = '/var/log/nginx/access.log';
if (fs.existsSync(accessLogPath)) {
  const logContent = fs.readFileSync(accessLogPath, 'utf8');
  const lines = logContent.split('\n');
  const matchedLines = lines.filter(line => {
    return line.includes('/files') && line.includes('12/Aug/2026:17:5');
  });
  console.log(`Found ${matchedLines.length} matching lines.`);
  matchedLines.forEach(line => console.log(line));
} else {
  console.log(`Nginx access log not found at ${accessLogPath}`);
}
