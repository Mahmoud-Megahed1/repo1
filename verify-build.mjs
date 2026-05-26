import { readFileSync } from 'fs';
try {
  const content = readFileSync('/var/www/repo1/frontend/englishom-ques/dist/index.js', 'utf8');
  console.log("Has logger?", content.includes('[HTTP Request]'));
  console.log("Has Login Error catch?", content.includes('[Login Error]'));
  console.log("Has 127.0.0.1 axios URL?", content.includes('127.0.0.1:5000/api/admin/auth/login'));
} catch (e) {
  console.error(e.message);
}
