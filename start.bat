@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
echo Starting Dr. App... Please wait.
cd /d "f:\Personal Projects\drapp"
npm install && npm run dev
pause
