#!/bin/bash
set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting Server Provisioning for englishom.com...${NC}"

# 1. Update System
echo -e "${GREEN}[1/7] Updating System...${NC}"
apt-get update && apt-get upgrade -y
apt-get install -y curl wget gnupg git unzip build-essential

# 2. Cleanup (Specific Request)
echo -e "${GREEN}[2/7] Cleaning up...${NC}"
if id "developer7850" &>/dev/null; then
    deluser --remove-home developer7850
    echo "User developer7850 removed."
else
    echo "User developer7850 not found."
fi

# 3. Install Node.js 20 (LTS)
echo -e "${GREEN}[3/7] Installing Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2 yarn

# 4. Install MongoDB 7.0
echo -e "${GREEN}[4/7] Installing MongoDB 7.0...${NC}"
apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# 5. Install Nginx & Certbot
echo -e "${GREEN}[5/7] Installing Nginx & Certbot...${NC}"
apt-get install -y nginx certbot python3-certbot-nginx

# 6. Configure Firewall (Port 21098 + Web)
echo -e "${GREEN}[6/7] Configuring Firewall...${NC}"
ufw allow 21098/tcp
ufw allow 'Nginx Full'
ufw allow OpenSSH
# Ensure we don't lock ourselves out if SSH port isn't standard in ufw yet
ufw --force enable

# 7. Setup Directories
echo -e "${GREEN}[7/7] Setting up directories...${NC}"
mkdir -p /var/www/englishom/backend
mkdir -p /var/www/englishom/admin
mkdir -p /var/www/englishom/user
chown -R root:root /var/www/englishom

echo -e "${GREEN}Provisioning Complete!${NC}"
echo "Next Steps:"
echo "1. Upload your zip files to /var/www/englishom/"
echo "2. Run the deployment setup."
