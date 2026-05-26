import { execSync } from 'child_process';
try {
  const output = execSync('grep -r "proxy_pass" /etc/nginx/conf.d 2>/dev/null', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error("No proxy_pass found or dir missing");
}
