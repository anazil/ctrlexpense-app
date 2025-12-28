@echo off
echo ========================================
echo   CtrlExpense Deployment Preparation
echo ========================================
echo.

echo [1/4] Preparing backend...
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
echo Backend prepared successfully!
echo.

echo [2/4] Installing frontend dependencies...
cd ..\frontend
call npm install
echo Dependencies installed!
echo.

echo [3/4] Creating production environment file...
copy .env.example .env
echo Environment file created! Please update .env with your Render API URL.
echo.

echo [4/4] Building frontend...
call npm run build
echo Frontend built successfully!
echo.

echo ========================================
echo   Deployment Preparation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy backend to Render
echo 3. Update .env with your Render API URL
echo 4. Rebuild frontend: npm run build
echo 5. Deploy frontend to Netlify
echo.
echo See DEPLOYMENT.md for detailed instructions.
pause