@echo off
echo Starting Frontend Server...
cd /d %~dp0frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
echo.
echo Frontend Server starting on http://localhost:3000
echo This may take a minute to compile...
echo Press Ctrl+C to stop the server
echo.
call npm start
if errorlevel 1 (
    echo.
    echo Error starting frontend. Trying with npx...
    call npx react-scripts start
)
pause


