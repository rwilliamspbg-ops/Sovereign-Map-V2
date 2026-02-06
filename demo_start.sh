#!/bin/bash

# SovereignMap Auto-Build & Deploy Script
# Optimized for Ubuntu 22.04+

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}>>> Initializing SovereignMap Deployment Suite...${NC}"

# 1. Dependency Check: Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Installing via NodeSource...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}Node.js detected: $(node -v)${NC}"
fi

# 2. Project Setup
echo -e "${BLUE}>>> Installing Project Dependencies...${NC}"
npm install

# 3. Environment Check
if [ -z "$API_KEY" ]; then
    echo -e "${RED}WARNING: API_KEY environment variable is not set.${NC}"
    echo -e "Please run: export API_KEY='your-gemini-api-key-here'"
fi

# 4. Network Deployment
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo -e "${BLUE}>>> Launching Sovereign Mesh on Local Network...${NC}"
echo -e "${GREEN}Access URL: http://$LOCAL_IP:5173${NC}"

# Run the dev server with host exposure
npm run dev -- --host 0.0.0.0
