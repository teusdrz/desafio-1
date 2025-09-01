# 🚀 Quick Installation Guide - .NET 9 & Docker for macOS

## For Your macOS System

### 1. Install .NET 9 SDK

**Using Homebrew (Recommended):**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install .NET 9
brew install --cask dotnet-sdk
```

**Verify Installation:**
```bash
dotnet --version
# Should show 9.0.x
```

### 2. Install Docker Desktop

**Option 1: Download from Website (Recommended)**
1. Go to: https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Mac
3. Install the .dmg file
4. Launch Docker Desktop and complete setup

**Option 2: Using Homebrew:**
```bash
brew install --cask docker
```

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

### 3. Quick Setup

Once installed, run:
```bash
# Clone the project (if not already done)
git clone https://github.com/hypesoftlabs/desafio-1.git
cd desafio-1

# Run automated setup
chmod +x setup.sh
./setup.sh
```

### 4. Start the Application

```bash
# Start full application
docker-compose up -d

# Or start just frontend (current status)
cd frontend
npm run dev
```

## Current Status

✅ **Frontend**: Running at http://localhost:3001 with new purple/white design
🔄 **Backend**: Ready for .NET 9 development
🔄 **Database**: MongoDB configured in docker-compose
🔄 **Authentication**: Keycloak configured

## Next Steps

1. Install .NET 9 and Docker using commands above
2. The frontend is already running with the new design
3. Backend development can begin once .NET 9 is installed
4. Full application can be launched with `docker-compose up -d`

## Need Help?

- Check the complete guide: [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)
- Run the automated script: `./setup.sh`
- Contact for support if needed
