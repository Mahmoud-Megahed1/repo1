import { execSync } from 'child_process';
try {
  console.log("=== Reloading NGINX ===");
  console.log(execSync('nginx -s reload', { encoding: 'utf-8' }));
  console.log("Nginx reloaded successfully.");
} catch (e) {
  console.error("Error reloading nginx:", e.message);
}
