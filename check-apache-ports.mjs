import { execSync } from 'child_process';
try {
  console.log("=== Checking Apache httpd.conf ===");
  const output = execSync('grep -E "3000|3001|3002|3003|3004|3005" /etc/apache2/conf/httpd.conf /etc/apache2/conf.d/*.conf /usr/local/apache/conf/httpd.conf 2>/dev/null', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.log("No proxy rules found in Apache main config or access denied.");
}
