import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const frontendApps = [
  'englishom-blog',
  'englishom-ques',
  'englishom-dashboard',
  'englishom-level-test',
  'the-a1-code'
];

const backendEnvContent = fs.readFileSync('/var/www/repo1/backend_prod.env', 'utf-8');
const jwtMatch = backendEnvContent.match(/^JWT_SECRET=(.*)$/m);
const jwtSecret = jwtMatch ? jwtMatch[1].trim() : "prod_secret_992837482_secure_token_englishom_2026";

console.log("Found JWT_SECRET:", jwtSecret);

for (const app of frontendApps) {
  const envPath = `/var/www/repo1/frontend/${app}/.env`;
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  }
  
  if (!envContent.includes('JWT_SECRET=')) {
    console.log(`Injecting JWT_SECRET into ${app}/.env`);
    fs.appendFileSync(envPath, `\nJWT_SECRET=${jwtSecret}\n`);
  } else {
    console.log(`JWT_SECRET already exists in ${app}/.env`);
  }
}

console.log("=== Restarting PM2 to apply changes ===");
try {
  execSync('pm2 reload all', { stdio: 'inherit' });
  console.log("PM2 reloaded successfully.");
} catch (e) {
  console.error("Failed to reload PM2:", e.message);
}
