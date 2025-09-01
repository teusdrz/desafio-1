# Hypesoft Product Management System - Makefile
# This Makefile provides common development tasks

.PHONY: help setup start stop restart logs logs-api logs-frontend status clean build test test-backend test-frontend seed dev-backend dev-frontend install

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE=\033[0;34m
GREEN=\033[0;32m
YELLOW=\033[1;33m
RED=\033[0;31m
NC=\033[0m # No Color

# Helper function to print colored output
define print_info
	@echo "$(BLUE)[INFO]$(NC) $(1)"
endef

define print_success
	@echo "$(GREEN)[SUCCESS]$(NC) $(1)"
endef

define print_warning
	@echo "$(YELLOW)[WARNING]$(NC) $(1)"
endef

define print_error
	@echo "$(RED)[ERROR]$(NC) $(1)"
endef

# Check if Docker is running
check-docker:
	@docker info > /dev/null 2>&1 || (echo "$(RED)[ERROR]$(NC) Docker is not running. Please start Docker and try again." && exit 1)

## Show help message
help:
	@echo "$(BLUE)Hypesoft Product Management System - Makefile$(NC)"
	@echo ""
	@echo "$(GREEN)Usage:$(NC) make [TARGET]"
	@echo ""
	@echo "$(GREEN)Targets:$(NC)"
	@echo "  $(YELLOW)setup$(NC)          Setup the project for development"
	@echo "  $(YELLOW)start$(NC)          Start all services with Docker Compose"
	@echo "  $(YELLOW)stop$(NC)           Stop all services"
	@echo "  $(YELLOW)restart$(NC)        Restart all services"
	@echo "  $(YELLOW)logs$(NC)           Show logs from all services"
	@echo "  $(YELLOW)logs-api$(NC)       Show logs from API service only"
	@echo "  $(YELLOW)logs-frontend$(NC)  Show logs from frontend service only"
	@echo "  $(YELLOW)status$(NC)         Show status of all services"
	@echo "  $(YELLOW)clean$(NC)          Clean up Docker containers and volumes"
	@echo "  $(YELLOW)build$(NC)          Build all Docker images"
	@echo "  $(YELLOW)test$(NC)           Run all tests"
	@echo "  $(YELLOW)test-backend$(NC)   Run backend tests"
	@echo "  $(YELLOW)test-frontend$(NC)  Run frontend tests"
	@echo "  $(YELLOW)seed$(NC)           Seed database with sample data"
	@echo "  $(YELLOW)dev-backend$(NC)    Start backend in development mode"
	@echo "  $(YELLOW)dev-frontend$(NC)   Start frontend in development mode"
	@echo "  $(YELLOW)install$(NC)        Install dependencies for both frontend and backend"
	@echo "  $(YELLOW)help$(NC)           Show this help message"
	@echo ""

## Setup the project for development
setup:
	$(call print_info,Setting up Hypesoft Product Management System...)
	@if [ ! -f .env ]; then \
		$(call print_info,Creating .env file from .env.example...); \
		cp .env.example .env; \
		$(call print_success,.env file created. Please review and update the configuration.); \
	else \
		$(call print_warning,.env file already exists.); \
	fi
	$(call print_info,Installing backend dependencies...)
	@cd backend && dotnet restore
	$(call print_info,Installing frontend dependencies...)
	@cd frontend && npm install
	$(call print_success,Project setup completed!)
	$(call print_info,You can now run: make start)

## Start all services with Docker Compose
start: check-docker
	$(call print_info,Starting all services...)
	@docker-compose up -d
	$(call print_success,All services started!)
	$(call print_info,Services will be available at:)
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend API: http://localhost:5000"
	@echo "  - Swagger: http://localhost:5000/swagger"
	@echo "  - MongoDB Express: http://localhost:8081"
	@echo "  - Keycloak: http://localhost:8080"

## Stop all services
stop: check-docker
	$(call print_info,Stopping all services...)
	@docker-compose down
	$(call print_success,All services stopped!)

## Restart all services
restart: check-docker
	$(call print_info,Restarting all services...)
	@docker-compose restart
	$(call print_success,All services restarted!)

## Show logs from all services
logs: check-docker
	@docker-compose logs -f

## Show logs from API service only
logs-api: check-docker
	@docker-compose logs -f backend

## Show logs from frontend service only
logs-frontend: check-docker
	@docker-compose logs -f frontend

## Show status of all services
status: check-docker
	$(call print_info,Service status:)
	@docker-compose ps

## Clean up Docker containers and volumes
clean: check-docker
	$(call print_warning,This will remove all containers, networks, and volumes.)
	@echo -n "Are you sure? (y/N): "; \
	read answer; \
	if [ "$$answer" = "y" ] || [ "$$answer" = "Y" ]; then \
		$(call print_info,Cleaning up Docker resources...); \
		docker-compose down -v --remove-orphans; \
		docker-compose rm -f; \
		$(call print_success,Cleanup completed!); \
	else \
		$(call print_info,Cleanup cancelled.); \
	fi

## Build all Docker images
build: check-docker
	$(call print_info,Building all Docker images...)
	@docker-compose build --no-cache
	$(call print_success,All images built successfully!)

## Run all tests
test: test-backend test-frontend
	$(call print_success,All tests completed!)

## Run backend tests
test-backend:
	$(call print_info,Running backend tests...)
	@cd backend && dotnet test --logger "console;verbosity=detailed"
	$(call print_success,Backend tests completed!)

## Run frontend tests
test-frontend:
	$(call print_info,Running frontend tests...)
	@cd frontend && npm test
	$(call print_success,Frontend tests completed!)

## Seed database with sample data
seed: check-docker
	$(call print_info,Seeding database with sample data...)
	@docker-compose restart mongodb
	@sleep 5
	$(call print_success,Database seeded successfully!)

## Start backend in development mode
dev-backend:
	$(call print_info,Starting backend in development mode...)
	@cd backend && dotnet watch run --project src/Hypesoft.API

## Start frontend in development mode
dev-frontend:
	$(call print_info,Starting frontend in development mode...)
	@cd frontend && npm run dev

## Install dependencies for both frontend and backend
install:
	$(call print_info,Installing dependencies...)
	$(call print_info,Installing backend dependencies...)
	@cd backend && dotnet restore
	$(call print_info,Installing frontend dependencies...)
	@cd frontend && npm install
	$(call print_success,Dependencies installed successfully!)

# Development workflows
## Quick development setup (setup + start)
quick-start: setup start

## Full rebuild (clean + build + start)
rebuild: clean build start

## Development restart (stop + build + start)
dev-restart: stop build start
