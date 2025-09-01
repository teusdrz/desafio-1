#!/bin/bash

# Hypesoft Challenge - Automated Setup Script
# This script installs all prerequisites and sets up the development environment

set -e

echo "🚀 Hypesoft Challenge - Automated Setup"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Detect operating system
OS=""
case "$(uname -s)" in
    Darwin*)    OS="mac";;
    Linux*)     OS="linux";;
    CYGWIN*|MINGW*)    OS="windows";;
    *)          OS="unknown";;
esac

print_info "Detected OS: $OS"

# Check if running on macOS
if [[ "$OS" != "mac" ]]; then
    print_warning "This script is optimized for macOS. For other systems, please refer to INSTALLATION_GUIDE.md"
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check and install Homebrew
install_homebrew() {
    if command_exists brew; then
        print_status "Homebrew is already installed"
    else
        print_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Add Homebrew to PATH for Apple Silicon Macs
        if [[ $(uname -m) == "arm64" ]]; then
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
            eval "$(/opt/homebrew/bin/brew shellenv)"
        fi
        
        print_status "Homebrew installed successfully"
    fi
}

# Check and install .NET 9
install_dotnet() {
    if command_exists dotnet; then
        DOTNET_VERSION=$(dotnet --version)
        if [[ $DOTNET_VERSION == 9.* ]]; then
            print_status ".NET 9 is already installed (version: $DOTNET_VERSION)"
        else
            print_warning ".NET is installed but not version 9 (current: $DOTNET_VERSION)"
            print_info "Installing .NET 9..."
            brew install --cask dotnet-sdk
        fi
    else
        print_info "Installing .NET 9 SDK..."
        brew install --cask dotnet-sdk
        print_status ".NET 9 SDK installed successfully"
    fi
}

# Check and install Docker
install_docker() {
    if command_exists docker; then
        print_status "Docker is already installed"
        if ! docker info >/dev/null 2>&1; then
            print_warning "Docker is installed but not running. Please start Docker Desktop."
        fi
    else
        print_info "Installing Docker Desktop..."
        brew install --cask docker
        print_status "Docker Desktop installed successfully"
        print_warning "Please start Docker Desktop manually and complete the setup"
    fi
}

# Check and install Node.js
install_nodejs() {
    if command_exists node; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is already installed (version: $NODE_VERSION)"
    else
        print_info "Installing Node.js..."
        brew install node
        print_status "Node.js installed successfully"
    fi
}

# Check and install Git
install_git() {
    if command_exists git; then
        print_status "Git is already installed"
    else
        print_info "Installing Git..."
        brew install git
        print_status "Git installed successfully"
    fi
}

# Setup project
setup_project() {
    print_info "Setting up project environment..."
    
    # Copy environment file
    if [[ ! -f .env ]]; then
        if [[ -f .env.example ]]; then
            cp .env.example .env
            print_status "Environment file created from .env.example"
        else
            print_warning ".env.example not found, skipping environment setup"
        fi
    else
        print_status "Environment file already exists"
    fi
    
    # Install frontend dependencies
    if [[ -d "frontend" ]]; then
        print_info "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        print_status "Frontend dependencies installed"
    fi
    
    # Restore backend dependencies
    if [[ -d "backend" ]]; then
        print_info "Restoring backend dependencies..."
        cd backend
        dotnet restore
        cd ..
        print_status "Backend dependencies restored"
    fi
}

# Verify installation
verify_installation() {
    print_info "Verifying installation..."
    
    echo ""
    echo "🔍 Installation Verification:"
    echo "=============================="
    
    # Check .NET
    if command_exists dotnet; then
        DOTNET_VERSION=$(dotnet --version)
        echo "✅ .NET SDK: $DOTNET_VERSION"
    else
        echo "❌ .NET SDK: Not found"
    fi
    
    # Check Docker
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        echo "✅ Docker: $DOCKER_VERSION"
    else
        echo "❌ Docker: Not found"
    fi
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        echo "✅ Node.js: $NODE_VERSION"
    else
        echo "❌ Node.js: Not found"
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        echo "✅ npm: $NPM_VERSION"
    else
        echo "❌ npm: Not found"
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        echo "✅ Git: $GIT_VERSION"
    else
        echo "❌ Git: Not found"
    fi
}

# Main installation process
main() {
    echo ""
    print_info "Starting automated setup process..."
    echo ""
    
    # Install prerequisites
    install_homebrew
    install_dotnet
    install_docker
    install_nodejs
    install_git
    
    echo ""
    setup_project
    
    echo ""
    verify_installation
    
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "Next steps:"
    echo "1. Ensure Docker Desktop is running"
    echo "2. Run the application:"
    echo "   - Full stack: docker-compose up -d"
    echo "   - Frontend only: cd frontend && npm run dev"
    echo "   - Backend only: cd backend && dotnet run --project src/Hypesoft.API"
    echo ""
    echo "Application URLs:"
    echo "- Frontend: http://localhost:3000"
    echo "- API: http://localhost:5000"
    echo "- Swagger: http://localhost:5000/swagger"
    echo "- MongoDB Express: http://localhost:8081"
    echo "- Keycloak: http://localhost:8080"
    echo ""
    echo "For detailed documentation, see:"
    echo "- README.md"
    echo "- INSTALLATION_GUIDE.md"
    echo ""
}

# Run main function
main "$@"
