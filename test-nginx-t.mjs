import { execSync } from 'child_process';
try {
  console.log("=== NGINX -T OUTPUT ===");
  const output = execSync('nginx -T 2>&1 | grep -E "server_name|proxy_pass|location"', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error(e.message);
}
