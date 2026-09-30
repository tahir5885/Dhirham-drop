#!/usr/bin/env bash
# ==============================================================================
# DirhamDrop - Production VPS Automated Deployment Script
# Supports: Ubuntu 20.04/22.04/24.04, Debian 11/12, CentOS/RHEL 9
# ==============================================================================

set -e

# Terminal formatting
BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RED="\033[31m"
RESET="\033[0m"

echo -e "${BOLD}${CYAN}"
echo "========================================================"
echo "    DirhamDrop - Production VPS Deployment Script       "
echo "========================================================"
echo -e "${RESET}"

# 1. Check Root / Sudo privileges
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}Notice: Please run with sudo or as root if Docker is not yet installed.${RESET}"
fi

# 2. Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo -e "${YELLOW}[1/4] Docker not found. Installing Docker engine via official script...${RESET}"
  curl -fsSL https://get.docker.com -o /tmp/get-docker.sh
  sh /tmp/get-docker.sh
  rm -f /tmp/get-docker.sh
  echo -e "${GREEN}✓ Docker installed successfully.${RESET}"
else
  echo -e "${GREEN}✓ Docker is already installed: $(docker --version)${RESET}"
fi

# 3. Check if Docker Compose plugin is installed
if ! docker compose version &> /dev/null; then
  echo -e "${YELLOW}[2/4] Installing Docker Compose plugin...${RESET}"
  apt-get update && apt-get install -y docker-compose-plugin || yum install -y docker-compose-plugin
  echo -e "${GREEN}✓ Docker Compose installed.${RESET}"
else
  echo -e "${GREEN}✓ Docker Compose is ready: $(docker compose version)${RESET}"
fi

# 4. Check for .env file
if [ ! -f .env ]; then
  echo -e "${YELLOW}[3/4] Creating .env from .env.production template...${RESET}"
  if [ -f .env.production ]; then
    cp .env.production .env
  elif [ -f .env.production.example ]; then
    cp .env.production.example .env
  elif [ -f .env.example ]; then
    cp .env.example .env
  fi

  # Generate random NEXTAUTH_SECRET if empty
  RANDOM_SECRET=$(openssl rand -hex 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
  sed -i "s/NEXTAUTH_SECRET=\"\"/NEXTAUTH_SECRET=\"$RANDOM_SECRET\"/g" .env || true
  sed -i "s/NEXTAUTH_SECRET=\"dev_secret_auth_key\"/NEXTAUTH_SECRET=\"$RANDOM_SECRET\"/g" .env || true
  echo -e "${GREEN}✓ Created .env with generated secure NEXTAUTH_SECRET.${RESET}"
else
  echo -e "${GREEN}✓ Existing .env detected.${RESET}"
fi

# 5. Build and launch containers
echo -e "${YELLOW}[4/4] Building and launching DirhamDrop containers with Docker Compose...${RESET}"
docker compose down || true
docker compose up -d --build

echo ""
echo -e "${BOLD}${GREEN}========================================================${RESET}"
echo -e "${BOLD}${GREEN}🎉 DirhamDrop is now running in production!${RESET}"
echo -e "${BOLD}${GREEN}========================================================${RESET}"
echo ""
echo -e "Access your application at:  ${BOLD}${CYAN}http://$(curl -s ifconfig.me || echo 'YOUR_SERVER_IP'):3000${RESET}"
echo ""
echo "Useful Commands:"
echo "  - View live web logs:       docker compose logs -f web"
echo "  - Restart services:         docker compose restart"
echo "  - Stop services:            docker compose down"
echo "  - Status check:             docker compose ps"
echo ""
