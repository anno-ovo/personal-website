@echo off
setlocal
title SoundShape Portfolio - Local Server

cd /d "%~dp0"

set "NODE_BIN=C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
set "PNPM_CMD=C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
set "PNPM_STORE=E:\.pnpm-store"
set "PATH=%NODE_BIN%;%PATH%"

echo.
echo ================================================
echo   SoundShape Portfolio Local Server
echo ================================================
echo.
echo URL: http://127.0.0.1:5173/
echo.
echo Keep this window open while previewing the site.
echo If you close this window, the browser will show connection refused.
echo.

netstat -ano | findstr ":5173" | findstr "LISTENING" >nul
if %errorlevel%==0 (
  echo Port 5173 already has a running service.
  echo Open: http://127.0.0.1:5173/
  echo.
  pause
  exit /b 0
)

if not exist "%PNPM_CMD%" (
  echo pnpm was not found:
  echo %PNPM_CMD%
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call "%PNPM_CMD%" install --store-dir "%PNPM_STORE%"
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting Vite...
echo.
call "%PNPM_CMD%" run dev

echo.
echo Server stopped. Run this file again to preview the site.
pause
