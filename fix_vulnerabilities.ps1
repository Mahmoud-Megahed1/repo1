$ErrorActionPreference = "Stop"

Write-Host "Fixing vulnerabilities in Backend (FORCE mode)..." -ForegroundColor Red
cd backend
npm audit fix --force
cd ..

Write-Host "Fixing vulnerabilities in Admin Panel (FORCE mode)..." -ForegroundColor Red
cd frontend/admin-englishom
npm audit fix --force
cd ../..

Write-Host "Fixing vulnerabilities in User App..." -ForegroundColor Green
cd frontend/english-home-vite
npm audit fix
cd ../..

Write-Host "Vulnerability fix process completed! Please run ./build_all.ps1 to verify the project still builds correctly." -ForegroundColor Cyan
