@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Dr. App... Please wait.
cd /d "f:\Personal Projects\Dr app"
npm install && npm run dev
pause
