#!/bin/bash
set -e

echo "===== Deploying Sub-Applications ====="

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/englishom/frontend

# 1. Englishom Blog (Port 3001)
echo "--- Building Blog ---"
cd englishom-blog
npm install --legacy-peer-deps
npm run build
pm2 delete englishom-blog 2>/dev/null || true
PORT=3001 pm2 start npm --name "englishom-blog" -- start
cd ..

# 2. Englishom Dashboard (Port 3002)
echo "--- Building Dashboard ---"
cd englishom-dashboard
npm install --legacy-peer-deps
npm run build
pm2 delete englishom-dashboard 2>/dev/null || true
PORT=3002 pm2 start npm --name "englishom-dashboard" -- start
cd ..

# 3. Englishom Level Test (Port 3003)
echo "--- Building Level Test ---"
cd englishom-level-test
npm install --legacy-peer-deps
npm run build
pm2 delete englishom-level-test 2>/dev/null || true
PORT=3003 pm2 start npm --name "englishom-level-test" -- start
cd ..

# 4. Englishom Ques (Port 3004)
echo "--- Building Ques ---"
cd englishom-ques
npm install --legacy-peer-deps
npm run build
pm2 delete englishom-ques 2>/dev/null || true
PORT=3004 pm2 start npm --name "englishom-ques" -- start
cd ..

# 5. Englishom Student Progress (Static)
echo "--- Building Student Progress ---"
cd englishom-student-progress
npm install --legacy-peer-deps
npm run build
cd ..

# 6. Landing Page (Static)
echo "--- Building Landing Page ---"
cd the-a1-code-landing-page
npm install --legacy-peer-deps
npm run build
cd ..

# 7. Rebuild Main Vite App to Trigger Symlinks
echo "--- Rebuilding Main App for Symlinks ---"
cd english-home-vite
npm install --legacy-peer-deps
npm run build
cd ..

# 8. Save PM2
echo "--- Saving PM2 state ---"
pm2 save

echo "===== DONE! All Sub-Applications are running! ====="
pm2 list
