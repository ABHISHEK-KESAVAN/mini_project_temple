@echo off
echo ========================================
echo   Verifying Setup
echo ========================================
echo.

echo Checking files...
if exist backend\server.js (echo [OK] Backend server.js) else (echo [X] Missing backend\server.js)
if exist frontend\package.json (echo [OK] Frontend package.json) else (echo [X] Missing frontend\package.json)
if exist backend\.env (echo [OK] Backend .env file) else (echo [X] Missing backend\.env)
if exist start-all.bat (echo [OK] start-all.bat) else (echo [X] Missing start-all.bat)
echo.

echo Checking dependencies...
if exist backend\node_modules (echo [OK] Backend dependencies) else (echo [X] Backend dependencies missing - run: cd backend ^&^& npm install)
if exist frontend\node_modules (echo [OK] Frontend dependencies) else (echo [X] Frontend dependencies missing - run: cd frontend ^&^& npm install)
echo.

echo Checking MongoDB connection...
echo MONGODB_URI from .env:
type backend\.env | findstr MONGODB_URI
echo.

echo ========================================
echo   Setup Verification Complete
echo ========================================
echo.
echo If all items show [OK], you can run start-all.bat
echo If any show [X], fix those issues first
echo.
pause

