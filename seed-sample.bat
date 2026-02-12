@echo off
echo ========================================
echo   Seeding Sample Data (MongoDB)
echo ========================================
echo.

cd /d %~dp0
echo Using backend\.env for DB connection...
echo.

node backend\scripts\seedSample.js

echo.
echo Done. Now refresh the website to see sample content.
pause


