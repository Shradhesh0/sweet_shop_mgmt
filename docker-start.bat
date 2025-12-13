@echo off
REM Docker startup script for Sweet Shop Management System (Windows)

echo 🍬 Starting Sweet Shop Management System...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    exit /b 1
)

REM Build and start services
echo 📦 Building and starting services...
docker-compose up -d --build

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ Services started!
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:3000/api
echo.
echo 📝 View logs: docker-compose logs -f
echo 🛑 Stop services: docker-compose down

