import { readFileSync, existsSync } from 'fs';

const paths = [
  '/etc/nginx/sites-available/englishom',
  '/etc/nginx/sites-available/default',
  '/etc/nginx/sites-enabled/englishom',
  '/etc/nginx/nginx.conf',
  '/var/www/repo1/frontend/englishom-blog/nginx.conf'
];

let found = false;
for (const p of paths) {
  if (existsSync(p)) {
    console.log(`\n=== NGINX CONFIG: ${p} ===`);
    const content = readFileSync(p, 'utf8');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('proxy_pass') || lines[i].includes('location')) {
        console.log(`L${i+1}: ${lines[i].trim()}`);
      }
    }
    found = true;
  }
}
if (!found) {
  console.log("Could not find NGINX config.");
}
