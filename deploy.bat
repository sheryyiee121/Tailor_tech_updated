@echo off
REM TailorTech Deployment Script for Windows
REM Supports both Vercel and Netlify deployments

echo.
echo ============================================
echo    TailorTech Deployment Script (Windows)
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
echo.

echo Building the project...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo Build failed. Please fix the errors and try again.
    pause
    exit /b 1
)

echo.
echo Build successful!
echo.
echo Choose your deployment platform:
echo 1. Vercel
echo 2. Netlify
echo 3. Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Vercel...
    
    REM Check if Vercel CLI is installed
    where vercel >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing Vercel CLI...
        call npm i -g vercel
    )
    
    echo.
    echo Starting Vercel deployment...
    call vercel --prod
    
    echo.
    echo Deployment to Vercel complete!
    echo.
    echo Remember to set environment variables in Vercel dashboard:
    echo    - GOOGLE_API_KEY
    echo    - GOOGLE_CX
    echo    - SCRAPINGDOG_API_KEY
) else if "%choice%"=="2" (
    echo.
    echo Deploying to Netlify...
    
    REM Check if Netlify CLI is installed
    where netlify >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing Netlify CLI...
        call npm i -g netlify-cli
    )
    
    echo.
    echo Starting Netlify deployment...
    call netlify deploy --prod
    
    echo.
    echo Deployment to Netlify complete!
    echo.
    echo Remember to set environment variables in Netlify dashboard:
    echo    - GOOGLE_API_KEY
    echo    - GOOGLE_CX
    echo    - SCRAPINGDOG_API_KEY
) else if "%choice%"=="3" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Exiting...
    pause
    exit /b 1
)

echo.
echo ============================================
echo    Deployment process complete!
echo ============================================
echo.
echo Next steps:
echo 1. Set environment variables in your hosting platform
echo 2. Update Firebase authorized domains
echo 3. Test all features in production
echo.
echo Happy deploying!
echo.
pause
