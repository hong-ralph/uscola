#!/bin/bash

# 오라클 클라우드 서버 초기 설정 스크립트
set -e

echo "🔧 Setting up Oracle Cloud server for Docker deployment..."

# 시스템 업데이트
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Docker 설치
echo "🐳 Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Docker Compose 설치
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 현재 사용자를 docker 그룹에 추가
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# 방화벽 설정 (ufw 사용)
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # Backend API

# Git 설치
echo "📦 Installing Git..."
sudo apt install -y git curl unzip

# 필요한 디렉토리 생성
echo "📁 Creating deployment directories..."
mkdir -p ~/uscola-deploy
cd ~/uscola-deploy

echo "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Reboot server: sudo reboot"
echo "2. Clone your repository: git clone https://github.com/YOUR_USERNAME/uscola.git"
echo "3. Set environment variables in ~/.bashrc:"
echo "   export GITHUB_TOKEN=your_github_token"
echo "   export GITHUB_ACTOR=your_github_username"
echo "   export GITHUB_REPOSITORY=your_username/uscola"
echo "4. Run deployment: cd uscola/deploy && ./deploy.sh"