$ErrorActionPreference = "Stop"

Write-Host "Building Backend..." -ForegroundColor Green
cd backend
npm install
npm run build
cd ..

Write-Host "Building Admin Panel..." -ForegroundColor Green
cd frontend/admin-englishom
npm install
npm run build
cd ../..

Write-Host "Building User App..." -ForegroundColor Green
cd frontend/english-home-vite
npm install
npm run build
cd ../..

Write-Host "All builds completed successfully!" -ForegroundColor Cyan
