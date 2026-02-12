@echo off
echo ========================================
echo   Temple Management System
echo   Starting Backend and Frontend
echo ========================================
echo.

REM Check if MongoDB connection is configured
if not exist backend\.env (
    echo Creating backend\.env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/temple_management
        echo JWT_SECRET=temple_management_secret_key_change_in_production_12345
        echo PORT=5000
    ) > backend\.env
    echo .env file created!
    echo.
)

REM Start Backend in new window (from project root so backend/server.js and backend/.env are used)
echo Starting Backend Server...
start "Backend Server - Port 5000" cmd /k "cd /d %~dp0 && node backend/server.js"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start Frontend in new window
echo Starting Frontend Server...
start "Frontend Server - Port 3000" cmd /k "cd /d %~dp0frontend && npm start"
echo.
echo If frontend fails with "Lock compromised" or missing modules, run in frontend folder:
echo   npm install
echo Then run this script again.

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin/login
echo.
echo Two windows have opened - one for each server.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this window...
pause >nul


