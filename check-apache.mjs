import { execSync } from 'child_process';
try {
  console.log("=== Checking .htaccess files ===");
  const output = execSync('grep -RE "ProxyPass|RewriteRule.*\\[P\\]" /home/*/public_html/ 2>/dev/null', { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.log("No proxy rules found in .htaccess files or access denied.");
}
