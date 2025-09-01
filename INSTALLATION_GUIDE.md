# .NET 9 and Docker Installation Guide for Hypesoft Challenge

## Prerequisites

Before setting up the Hypesoft Product Management System, you need to install the following components:

### 1. .NET 9 SDK Installation

#### For macOS:

**Option 1: Using Homebrew (Recommended)**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install .NET 9
brew install --cask dotnet-sdk
```

**Option 2: Direct Download**
1. Visit the official Microsoft .NET download page: https://dotnet.microsoft.com/download/dotnet/9.0
2. Download the .NET 9.0 SDK for macOS (choose your architecture: x64 or arm64)
3. Run the installer package (.pkg file)
4. Follow the installation wizard

**Verify Installation:**
```bash
dotnet --version
# Should output 9.0.x
```

#### For Windows:

**Option 1: Using Winget**
```powershell
winget install Microsoft.DotNet.SDK.9
```

**Option 2: Direct Download**
1. Visit: https://dotnet.microsoft.com/download/dotnet/9.0
2. Download the .NET 9.0 SDK for Windows
3. Run the installer (.exe file)
4. Follow the installation wizard

#### For Linux (Ubuntu/Debian):

```bash
# Add Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Update package index
sudo apt-get update

# Install .NET 9 SDK
sudo apt-get install -y dotnet-sdk-9.0
```

### 2. Docker Installation

#### For macOS:

**Option 1: Docker Desktop (Recommended)**
1. Visit: https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Mac (choose Intel or Apple Silicon)
3. Install the .dmg file
4. Launch Docker Desktop
5. Accept the license agreement
6. Sign in with your Docker Hub account (optional)

**Option 2: Using Homebrew**
```bash
brew install --cask docker
```

#### For Windows:

**Docker Desktop for Windows**
1. Visit: https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Windows
3. Run the installer
4. During installation, ensure "Use WSL 2 instead of Hyper-V" is checked
5. Restart your computer when prompted
6. Launch Docker Desktop

#### For Linux (Ubuntu):

```bash
# Remove any old Docker installations
sudo apt-get remove docker docker-engine docker.io containerd runc

# Update package index
sudo apt-get update

# Install packages to allow apt to use HTTPS
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add your user to the docker group
sudo usermod -aG docker $USER
```

**Verify Docker Installation:**
```bash
docker --version
# Should output Docker version 24.x.x or later

docker-compose --version
# Should output Docker Compose version 2.x.x or later
```

### 3. Additional Tools

#### Node.js (for frontend development)
```bash
# macOS with Homebrew
brew install node

# Or download from: https://nodejs.org/
```

#### Git
```bash
# macOS with Homebrew
brew install git

# Windows: Download from https://git-scm.com/
# Linux: sudo apt-get install git
```

#### MongoDB Compass (Optional - for database management)
Download from: https://www.mongodb.com/products/compass

#### Postman (Optional - for API testing)
Download from: https://www.postman.com/downloads/

## Next Steps

After installing these prerequisites, you can:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hypesoftlabs/desafio-1.git
   cd desafio-1
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the complete application:**
   ```bash
   docker-compose up -d
   ```

4. **For development:**
   ```bash
   # Frontend
   cd frontend
   npm install
   npm run dev

   # Backend
   cd backend
   dotnet restore
   dotnet run
   ```

## Troubleshooting

### Common Issues:

1. **Port conflicts:**
   - Frontend: Change port in package.json
   - Backend: Update launchSettings.json
   - Docker: Modify docker-compose.yml

2. **Permission issues on Linux:**
   ```bash
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **.NET version conflicts:**
   ```bash
   dotnet --list-sdks
   # Use global.json to specify version
   ```

4. **Docker service not running:**
   - Ensure Docker Desktop is running
   - On Linux: `sudo systemctl start docker`

## System Requirements

- **RAM:** 8GB minimum, 16GB recommended
- **Storage:** 10GB free space
- **OS:** 
  - macOS 11.0 or later
  - Windows 10/11 with WSL 2
  - Ubuntu 20.04 LTS or later

## Environment URLs (After setup)

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **MongoDB Express:** http://localhost:8081
- **Keycloak:** http://localhost:8080

For detailed setup instructions, refer to the main README.md file.
