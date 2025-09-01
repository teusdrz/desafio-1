#!/bin/bash

# Hypesoft Product Management System - Development Scripts
# This script provides common development tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Hypesoft Product Management System - Development Scripts"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup          Setup the project for development"
    echo "  start          Start all services with Docker Compose"
    echo "  stop           Stop all services"
    echo "  restart        Restart all services"
    echo "  logs           Show logs from all services"
    echo "  logs-api       Show logs from API service only"
    echo "  logs-frontend  Show logs from frontend service only"
    echo "  status         Show status of all services"
    echo "  clean          Clean up Docker containers and volumes"
    echo "  build          Build all Docker images"
    echo "  test           Run all tests"
    echo "  test-backend   Run backend tests"
    echo "  test-frontend  Run frontend tests"
    echo "  seed           Seed database with sample data"
    echo "  dev-backend    Start backend in development mode"
    echo "  dev-frontend   Start frontend in development mode"
    echo "  install        Install dependencies for both frontend and backend"
    echo "  help           Show this help message"
    echo ""
}

# Setup project
setup() {
    print_info "Setting up Hypesoft Product Management System..."
    
    if [ ! -f .env ]; then
        print_info "Creating .env file from .env.example..."
        cp .env.example .env
        print_success ".env file created. Please review and update the configuration."
    else
        print_warning ".env file already exists."
    fi
    
    print_info "Installing backend dependencies..."
    cd backend
    dotnet restore
    cd ..
    
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "Project setup completed!"
    print_info "You can now run: $0 start"
}

# Start all services
start() {
    check_docker
    print_info "Starting all services..."
    docker-compose up -d
    print_success "All services started!"
    print_info "Services will be available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Swagger: http://localhost:5000/swagger"
    echo "  - MongoDB Express: http://localhost:8081"
    echo "  - Keycloak: http://localhost:8080"
}

# Stop all services
stop() {
    check_docker
    print_info "Stopping all services..."
    docker-compose down
    print_success "All services stopped!"
}

# Restart all services
restart() {
    check_docker
    print_info "Restarting all services..."
    docker-compose restart
    print_success "All services restarted!"
}

# Show logs
logs() {
    check_docker
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Show status
status() {
    check_docker
    print_info "Service status:"
    docker-compose ps
}

# Clean up
clean() {
    check_docker
    print_warning "This will remove all containers, networks, and volumes."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up Docker resources..."
        docker-compose down -v --remove-orphans
        docker-compose rm -f
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

# Build all images
build() {
    check_docker
    print_info "Building all Docker images..."
    docker-compose build --no-cache
    print_success "All images built successfully!"
}

# Run all tests
test_all() {
    print_info "Running all tests..."
    test_backend
    test_frontend
    print_success "All tests completed!"
}

# Run backend tests
test_backend() {
    print_info "Running backend tests..."
    cd backend
    dotnet test --logger "console;verbosity=detailed"
    cd ..
    print_success "Backend tests completed!"
}

# Run frontend tests
test_frontend() {
    print_info "Running frontend tests..."
    cd frontend
    npm test
    cd ..
    print_success "Frontend tests completed!"
}

# Seed database
seed() {
    check_docker
    print_info "Seeding database with sample data..."
    # The MongoDB init script will automatically seed the database
    docker-compose restart mongodb
    sleep 5
    print_success "Database seeded successfully!"
}

# Development mode for backend
dev_backend() {
    print_info "Starting backend in development mode..."
    cd backend
    dotnet watch run --project src/Hypesoft.API
}

# Development mode for frontend
dev_frontend() {
    print_info "Starting frontend in development mode..."
    cd frontend
    npm run dev
}

# Install dependencies
install() {
    print_info "Installing dependencies..."
    
    print_info "Installing backend dependencies..."
    cd backend
    dotnet restore
    cd ..
    
    print_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully!"
}

# Main script logic
case "$1" in
    setup)
        setup
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    logs-api)
        logs "backend"
        ;;
    logs-frontend)
        logs "frontend"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    build)
        build
        ;;
    test)
        test_all
        ;;
    test-backend)
        test_backend
        ;;
    test-frontend)
        test_frontend
        ;;
    seed)
        seed
        ;;
    dev-backend)
        dev_backend
        ;;
    dev-frontend)
        dev_frontend
        ;;
    install)
        install
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            print_error "No command provided."
        else
            print_error "Unknown command: $1"
        fi
        echo ""
        show_help
        exit 1
        ;;
esac
