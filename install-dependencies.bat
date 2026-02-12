@echo off
echo ========================================
echo   Installing All Dependencies
echo ========================================
echo.

echo Installing root dependencies...
call npm install
echo.

echo Installing frontend dependencies...
cd frontend
call npm install
echo.

echo Installing react-scripts...
call npm install react-scripts@5.0.1 --save-dev
echo.

cd ..
echo.
echo ========================================
echo   Dependencies Installed!
echo ========================================
echo.
echo You can now run start-all.bat to start the servers
echo.
pause


