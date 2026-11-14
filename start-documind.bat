@echo off
title DocuMind — AI-Powered Knowledge Assistant
echo ===================================================
echo     DOCUMIND — AI-POWERED KNOWLEDGE ASSISTANT     
echo ===================================================
echo Starting local development server on Windows...
echo.

if not exist node_modules (
    echo [INFO] Installing required dependencies...
    call npm install
)

echo [INFO] Launching Vite development server...
call npm run dev

pause
