@echo off
echo ========================================================
echo Pushing Smart Visitor Management System to GitHub
echo Repository: https://github.com/kishor777777/smart-visitor-management-system.git
echo ========================================================
echo.
cd /d "%~dp0"
"C:\Users\Admin\AppData\Local\GitHubDesktop\app-3.5.2\resources\app\git\cmd\git.exe" push -u origin main
echo.
echo ========================================================
echo If successful, your code is now live on GitHub!
echo ========================================================
pause
