# Hypesoft Product Management System - Development Scripts (PowerShell)
# This script provides common development tasks

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Service
)

# Colors for output
$InfoColor = "Blue"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $SuccessColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $WarningColor
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $ErrorColor
}

function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        exit 1
    }
}

function Show-Help {
    Write-Host "Hypesoft Product Management System - Development Scripts" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  setup          Setup the project for development" -ForegroundColor Gray
    Write-Host "  start          Start all services with Docker Compose" -ForegroundColor Gray
    Write-Host "  stop           Stop all services" -ForegroundColor Gray
    Write-Host "  restart        Restart all services" -ForegroundColor Gray
    Write-Host "  logs           Show logs from all services" -ForegroundColor Gray
    Write-Host "  logs-api       Show logs from API service only" -ForegroundColor Gray
    Write-Host "  logs-frontend  Show logs from frontend service only" -ForegroundColor Gray
    Write-Host "  status         Show status of all services" -ForegroundColor Gray
    Write-Host "  clean          Clean up Docker containers and volumes" -ForegroundColor Gray
    Write-Host "  build          Build all Docker images" -ForegroundColor Gray
    Write-Host "  test           Run all tests" -ForegroundColor Gray
    Write-Host "  test-backend   Run backend tests" -ForegroundColor Gray
    Write-Host "  test-frontend  Run frontend tests" -ForegroundColor Gray
    Write-Host "  seed           Seed database with sample data" -ForegroundColor Gray
    Write-Host "  dev-backend    Start backend in development mode" -ForegroundColor Gray
    Write-Host "  dev-frontend   Start frontend in development mode" -ForegroundColor Gray
    Write-Host "  install        Install dependencies for both frontend and backend" -ForegroundColor Gray
    Write-Host "  help           Show this help message" -ForegroundColor Gray
    Write-Host ""
}

function Invoke-Setup {
    Write-Info "Setting up Hypesoft Product Management System..."
    
    if (-not (Test-Path ".env")) {
        Write-Info "Creating .env file from .env.example..."
        Copy-Item ".env.example" ".env"
        Write-Success ".env file created. Please review and update the configuration."
    } else {
        Write-Warning ".env file already exists."
    }
    
    Write-Info "Installing backend dependencies..."
    Set-Location "backend"
    dotnet restore
    Set-Location ".."
    
    Write-Info "Installing frontend dependencies..."
    Set-Location "frontend"
    npm install
    Set-Location ".."
    
    Write-Success "Project setup completed!"
    Write-Info "You can now run: .\dev.ps1 start"
}

function Start-Services {
    Test-Docker
    Write-Info "Starting all services..."
    docker-compose up -d
    Write-Success "All services started!"
    Write-Info "Services will be available at:"
    Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  - Backend API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "  - Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
    Write-Host "  - MongoDB Express: http://localhost:8081" -ForegroundColor Cyan
    Write-Host "  - Keycloak: http://localhost:8080" -ForegroundColor Cyan
}

function Stop-Services {
    Test-Docker
    Write-Info "Stopping all services..."
    docker-compose down
    Write-Success "All services stopped!"
}

function Restart-Services {
    Test-Docker
    Write-Info "Restarting all services..."
    docker-compose restart
    Write-Success "All services restarted!"
}

function Show-Logs {
    param([string]$ServiceName)
    Test-Docker
    if ($ServiceName) {
        docker-compose logs -f $ServiceName
    } else {
        docker-compose logs -f
    }
}

function Show-Status {
    Test-Docker
    Write-Info "Service status:"
    docker-compose ps
}

function Invoke-Clean {
    Test-Docker
    Write-Warning "This will remove all containers, networks, and volumes."
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Write-Info "Cleaning up Docker resources..."
        docker-compose down -v --remove-orphans
        docker-compose rm -f
        Write-Success "Cleanup completed!"
    } else {
        Write-Info "Cleanup cancelled."
    }
}

function Build-Images {
    Test-Docker
    Write-Info "Building all Docker images..."
    docker-compose build --no-cache
    Write-Success "All images built successfully!"
}

function Invoke-TestAll {
    Write-Info "Running all tests..."
    Invoke-TestBackend
    Invoke-TestFrontend
    Write-Success "All tests completed!"
}

function Invoke-TestBackend {
    Write-Info "Running backend tests..."
    Set-Location "backend"
    dotnet test --logger "console;verbosity=detailed"
    Set-Location ".."
    Write-Success "Backend tests completed!"
}

function Invoke-TestFrontend {
    Write-Info "Running frontend tests..."
    Set-Location "frontend"
    npm test
    Set-Location ".."
    Write-Success "Frontend tests completed!"
}

function Invoke-Seed {
    Test-Docker
    Write-Info "Seeding database with sample data..."
    # The MongoDB init script will automatically seed the database
    docker-compose restart mongodb
    Start-Sleep -Seconds 5
    Write-Success "Database seeded successfully!"
}

function Start-DevBackend {
    Write-Info "Starting backend in development mode..."
    Set-Location "backend"
    dotnet watch run --project src/Hypesoft.API
}

function Start-DevFrontend {
    Write-Info "Starting frontend in development mode..."
    Set-Location "frontend"
    npm run dev
}

function Install-Dependencies {
    Write-Info "Installing dependencies..."
    
    Write-Info "Installing backend dependencies..."
    Set-Location "backend"
    dotnet restore
    Set-Location ".."
    
    Write-Info "Installing frontend dependencies..."
    Set-Location "frontend"
    npm install
    Set-Location ".."
    
    Write-Success "Dependencies installed successfully!"
}

# Main script logic
switch ($Command) {
    "setup" { Invoke-Setup }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs -ServiceName $Service }
    "logs-api" { Show-Logs -ServiceName "backend" }
    "logs-frontend" { Show-Logs -ServiceName "frontend" }
    "status" { Show-Status }
    "clean" { Invoke-Clean }
    "build" { Build-Images }
    "test" { Invoke-TestAll }
    "test-backend" { Invoke-TestBackend }
    "test-frontend" { Invoke-TestFrontend }
    "seed" { Invoke-Seed }
    "dev-backend" { Start-DevBackend }
    "dev-frontend" { Start-DevFrontend }
    "install" { Install-Dependencies }
    "help" { Show-Help }
    "--help" { Show-Help }
    "-h" { Show-Help }
    default {
        if ([string]::IsNullOrEmpty($Command)) {
            Write-Error "No command provided."
        } else {
            Write-Error "Unknown command: $Command"
        }
        Write-Host ""
        Show-Help
        exit 1
    }
}
