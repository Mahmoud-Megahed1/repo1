$ErrorActionPreference = "Stop"

Write-Host "Zipping Backend Artifacts..." -ForegroundColor Green
$backendFiles = @(
    "backend/src",
    "backend/package.json",
    "backend/package-lock.json",
    "backend/tsconfig.json",
    "backend/tsconfig.build.json",
    "backend/nest-cli.json",
    "backend/.env"
)
Compress-Archive -Path $backendFiles -DestinationPath "backend_deploy.zip" -Force

Write-Host "Zipping Admin Panel Artifacts..." -ForegroundColor Green
# Next.js requires .next, public, package.json, and next.config.mjs (if exists)
$adminFiles = @(
    "frontend/admin-englishom/.next",
    "frontend/admin-englishom/public",
    "frontend/admin-englishom/package.json",
    "frontend/admin-englishom/package-lock.json",
    "frontend/admin-englishom/next.config.mjs"
)
# Check if next.config.js exists instead
if (Test-Path "frontend/admin-englishom/next.config.js") {
    $adminFiles += "frontend/admin-englishom/next.config.js"
}

Compress-Archive -Path $adminFiles -DestinationPath "admin_panel_deploy.zip" -Force

Write-Host "Zipping User App Artifacts..." -ForegroundColor Green
Compress-Archive -Path "frontend/english-home-vite/dist/*" -DestinationPath "user_app_deploy.zip" -Force

Write-Host "All artifacts zipped successfully!" -ForegroundColor Cyan
Write-Host "Files ready to upload:" -ForegroundColor Yellow
Write-Host "1. backend_deploy.zip"
Write-Host "2. admin_panel_deploy.zip"
Write-Host "3. user_app_deploy.zip"
