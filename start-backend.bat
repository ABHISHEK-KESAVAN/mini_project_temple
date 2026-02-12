@echo off
echo Starting Backend Server...
cd /d %~dp0

REM Check if dependencies are installed
if not exist node_modules\express (
    echo Installing backend dependencies...
    call npm install
)

cd backend
echo.
echo Backend Server starting on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
node server.js
pause


