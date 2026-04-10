#!/bin/bash

# 오라클 클라우드 배포 스크립트 (수동 실행용)
set -e

DEPLOY_DIR=~/uscola-deploy
cd $DEPLOY_DIR

echo "🔐 Logging into GitHub Container Registry..."
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down --remove-orphans || true

echo "📥 Pulling latest images..."
docker compose -f docker-compose.prod.yml pull

echo "🧹 Cleaning up unused images..."
docker image prune -f

echo "🚀 Starting services..."
docker compose -f docker-compose.prod.yml up -d

echo "🏥 Checking service health..."
timeout 60s bash -c 'until curl -sf http://localhost:4000/api/test; do echo "Waiting..."; sleep 5; done'

echo "📊 Service status:"
docker compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
