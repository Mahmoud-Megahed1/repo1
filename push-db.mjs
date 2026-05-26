import { execSync } from 'child_process';
try {
  console.log("=== Pushing schema for englishom-blog ===");
  console.log(execSync('cd /var/www/repo1/frontend/englishom-blog && npx drizzle-kit generate --config=drizzle/drizzle.config.ts && npx drizzle-kit migrate --config=drizzle/drizzle.config.ts', { encoding: 'utf-8' }));
  
  console.log("=== Pushing schema for englishom-ques ===");
  console.log(execSync('cd /var/www/repo1/frontend/englishom-ques && npm run db:push', { encoding: 'utf-8' }));
} catch (e) {
  console.error("Error pushing schema:", e.message);
  if (e.stdout) console.log(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
}
