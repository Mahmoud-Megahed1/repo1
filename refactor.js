const fs = require('fs');
const path = require('path');

const projects = [
  { name: 'englishom-level-test', prefix: 'test' },
  { name: 'englishom-ques', prefix: 'ques' },
  { name: 'englishom-dashboard', prefix: 'dashboard' },
  { name: 'the-a1-code-landing-page', prefix: 'Landingpage' },
  { name: 'englishom-blog', prefix: 'blog' },
  { name: 'englishom-student-progress', prefix: 'progress' }
];

const basePath = path.join(__dirname, 'frontend');

for (const proj of projects) {
  const dir = path.join(basePath, proj.name);
  if (!fs.existsSync(dir)) continue;

  // 1. vite.config.ts
  const vitePath = path.join(dir, 'vite.config.ts');
  if (fs.existsSync(vitePath)) {
    let content = fs.readFileSync(vitePath, 'utf8');
    if (!content.includes(`base: "/${proj.prefix}/"`)) {
      content = content.replace('export default defineConfig({', `export default defineConfig({\n  base: "/${proj.prefix}/",`);
      fs.writeFileSync(vitePath, content);
      console.log(`Updated vite.config.ts for ${proj.name}`);
    }
  }

  // 2. main.tsx
  const mainPath = path.join(dir, 'client/src/main.tsx');
  if (fs.existsSync(mainPath)) {
    let content = fs.readFileSync(mainPath, 'utf8');
    if (!content.includes(`url: "/${proj.prefix}/api/trpc"`)) {
      content = content.replace('url: "/api/trpc"', `url: "/${proj.prefix}/api/trpc"`);
      fs.writeFileSync(mainPath, content);
      console.log(`Updated main.tsx for ${proj.name}`);
    }
  }

  // 3. const.ts (for redirectUri)
  const constPath = path.join(dir, 'client/src/const.ts');
  if (fs.existsSync(constPath)) {
    let content = fs.readFileSync(constPath, 'utf8');
    if (!content.includes(`origin}/${proj.prefix}/api/oauth`)) {
      content = content.replace('/api/oauth/callback', `/${proj.prefix}/api/oauth/callback`);
      fs.writeFileSync(constPath, content);
      console.log(`Updated const.ts for ${proj.name}`);
    }
  }

  // 4. oauth.ts
  const oauthPath = path.join(dir, 'server/_core/oauth.ts');
  if (fs.existsSync(oauthPath)) {
    let content = fs.readFileSync(oauthPath, 'utf8');
    if (content.includes('res.redirect(302, "/")')) {
      content = content.replace('res.redirect(302, "/")', 'res.redirect(302, process.env.BASE_PATH || "/")');
      fs.writeFileSync(oauthPath, content);
      console.log(`Updated oauth.ts for ${proj.name}`);
    }
  }

  // 5. App.tsx (wrap Router)
  const appPath = path.join(dir, 'client/src/App.tsx');
  if (fs.existsSync(appPath) && proj.name !== 'englishom-student-progress' && proj.name !== 'englishom-level-test') {
    let content = fs.readFileSync(appPath, 'utf8');
    // For blog, just rely on Vite base since its routes are already prefixed with /blog
    if (proj.name !== 'englishom-blog') {
      if (!content.includes('<WouterRouter base=')) {
        content = content.replace('import { Route, Switch } from "wouter";', 'import { Route, Switch, Router as WouterRouter } from "wouter";');
        content = content.replace('<Switch>', `<WouterRouter base="/${proj.prefix}">\n      <Switch>`);
        content = content.replace('</Switch>', `</Switch>\n    </WouterRouter>`);
        fs.writeFileSync(appPath, content);
        console.log(`Updated App.tsx for ${proj.name}`);
      }
    }
  }
}
