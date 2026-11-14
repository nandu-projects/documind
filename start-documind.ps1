# DocuMind — Windows PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "    DOCUMIND — AI-POWERED KNOWLEDGE ASSISTANT     " -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Starting local development server on Windows..." -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing required dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "[INFO] Running verification tests..." -ForegroundColor Green
node test_documind.js

Write-Host "[INFO] Launching Vite development server at http://localhost:5173..." -ForegroundColor Cyan
npm run dev
