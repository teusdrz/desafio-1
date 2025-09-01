@echo off
REM Hypesoft Product Management System - Development Scripts for Windows
REM This script provides common development tasks

setlocal enabledelayedexpansion

REM Colors for output (Windows doesn't support colors in basic batch, but we'll use echo)
set "INFO=[INFO]"
set "SUCCESS=[SUCCESS]"
set "WARNING=[WARNING]"
set "ERROR=[ERROR]"

REM Function to show help
:show_help
echo Hypesoft Product Management System - Development Scripts
echo.
echo Usage: %~nx0 [COMMAND]
echo.
echo Commands:
echo   setup          Setup the project for development
echo   start          Start all services with Docker Compose
echo   stop           Stop all services
echo   restart        Restart all services
echo   logs           Show logs from all services
echo   logs-api       Show logs from API service only
echo   logs-frontend  Show logs from frontend service only
echo   status         Show status of all services
echo   clean          Clean up Docker containers and volumes
echo   build          Build all Docker images
echo   test           Run all tests
echo   test-backend   Run backend tests
echo   test-frontend  Run frontend tests
echo   seed           Seed database with sample data
echo   dev-backend    Start backend in development mode
echo   dev-frontend   Start frontend in development mode
echo   install        Install dependencies for both frontend and backend
echo   help           Show this help message
echo.
goto :eof

REM Check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    echo %ERROR% Docker is not running. Please start Docker and try again.
    exit /b 1
)
goto :eof

REM Setup project
:setup
echo %INFO% Setting up Hypesoft Product Management System...

if not exist .env (
    echo %INFO% Creating .env file from .env.example...
    copy .env.example .env >nul
    echo %SUCCESS% .env file created. Please review and update the configuration.
) else (
    echo %WARNING% .env file already exists.
)

echo %INFO% Installing backend dependencies...
cd backend
dotnet restore
cd ..

echo %INFO% Installing frontend dependencies...
cd frontend
npm install
cd ..

echo %SUCCESS% Project setup completed!
echo %INFO% You can now run: %~nx0 start
goto :eof

REM Start all services
:start
call :check_docker
echo %INFO% Starting all services...
docker-compose up -d
echo %SUCCESS% All services started!
echo %INFO% Services will be available at:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:5000
echo   - Swagger: http://localhost:5000/swagger
echo   - MongoDB Express: http://localhost:8081
echo   - Keycloak: http://localhost:8080
goto :eof

REM Stop all services
:stop
call :check_docker
echo %INFO% Stopping all services...
docker-compose down
echo %SUCCESS% All services stopped!
goto :eof

REM Restart all services
:restart
call :check_docker
echo %INFO% Restarting all services...
docker-compose restart
echo %SUCCESS% All services restarted!
goto :eof

REM Show logs
:logs
call :check_docker
if "%~2"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %2
)
goto :eof

REM Show status
:status
call :check_docker
echo %INFO% Service status:
docker-compose ps
goto :eof

REM Clean up
:clean
call :check_docker
echo %WARNING% This will remove all containers, networks, and volumes.
set /p confirm=Are you sure? (y/N): 
if /i "%confirm%"=="y" (
    echo %INFO% Cleaning up Docker resources...
    docker-compose down -v --remove-orphans
    docker-compose rm -f
    echo %SUCCESS% Cleanup completed!
) else (
    echo %INFO% Cleanup cancelled.
)
goto :eof

REM Build all images
:build
call :check_docker
echo %INFO% Building all Docker images...
docker-compose build --no-cache
echo %SUCCESS% All images built successfully!
goto :eof

REM Run all tests
:test_all
echo %INFO% Running all tests...
call :test_backend
call :test_frontend
echo %SUCCESS% All tests completed!
goto :eof

REM Run backend tests
:test_backend
echo %INFO% Running backend tests...
cd backend
dotnet test --logger "console;verbosity=detailed"
cd ..
echo %SUCCESS% Backend tests completed!
goto :eof

REM Run frontend tests
:test_frontend
echo %INFO% Running frontend tests...
cd frontend
npm test
cd ..
echo %SUCCESS% Frontend tests completed!
goto :eof

REM Seed database
:seed
call :check_docker
echo %INFO% Seeding database with sample data...
REM The MongoDB init script will automatically seed the database
docker-compose restart mongodb
timeout /t 5 /nobreak >nul
echo %SUCCESS% Database seeded successfully!
goto :eof

REM Development mode for backend
:dev_backend
echo %INFO% Starting backend in development mode...
cd backend
dotnet watch run --project src/Hypesoft.API
goto :eof

REM Development mode for frontend
:dev_frontend
echo %INFO% Starting frontend in development mode...
cd frontend
npm run dev
goto :eof

REM Install dependencies
:install
echo %INFO% Installing dependencies...

echo %INFO% Installing backend dependencies...
cd backend
dotnet restore
cd ..

echo %INFO% Installing frontend dependencies...
cd frontend
npm install
cd ..

echo %SUCCESS% Dependencies installed successfully!
goto :eof

REM Main script logic
if "%1"=="setup" goto setup
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="logs-api" (
    call :check_docker
    docker-compose logs -f backend
    goto :eof
)
if "%1"=="logs-frontend" (
    call :check_docker
    docker-compose logs -f frontend
    goto :eof
)
if "%1"=="status" goto status
if "%1"=="clean" goto clean
if "%1"=="build" goto build
if "%1"=="test" goto test_all
if "%1"=="test-backend" goto test_backend
if "%1"=="test-frontend" goto test_frontend
if "%1"=="seed" goto seed
if "%1"=="dev-backend" goto dev_backend
if "%1"=="dev-frontend" goto dev_frontend
if "%1"=="install" goto install
if "%1"=="help" goto show_help
if "%1"=="--help" goto show_help
if "%1"=="-h" goto show_help

if "%1"=="" (
    echo %ERROR% No command provided.
) else (
    echo %ERROR% Unknown command: %1
)
echo.
goto show_help
