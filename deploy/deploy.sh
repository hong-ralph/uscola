#!/bin/bash

# 오라클 클라우드 배포 스크립트
set -e

echo "🚀 Starting Oracle Cloud deployment..."

# 환경 변수 설정
export GITHUB_REPOSITORY=${GITHUB_REPOSITORY:-"ralph/uscola"}

# Docker 로그인 (GitHub Container Registry)
echo "🔐 Logging into GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

# 기존 컨테이너 중지 및 제거
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans || true

# 최신 이미지 pull
echo "📥 Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

# 사용하지 않는 이미지 정리
echo "🧹 Cleaning up unused images..."
docker image prune -f

# 서비스 시작
echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

# 헬스체크
echo "🏥 Checking service health..."
timeout 60s bash -c 'until curl -f http://localhost:4000/api/test; do echo "Waiting for backend..."; sleep 5; done'
timeout 60s bash -c 'until curl -f http://localhost:4000; do echo "Waiting for frontend..."; sleep 5; done'

# 서비스 상태 확인
echo "📊 Service status:"
docker compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed successfully!"
echo "🌐 Frontend: http://$(curl -s ifconfig.me):4000"
echo "🔧 Backend API: http://$(curl -s ifconfig.me):3000"