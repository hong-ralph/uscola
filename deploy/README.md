# 오라클 클라우드 배포 가이드

## 1. 오라클 클라우드 VM 인스턴스 생성

### Always Free 티어 설정:
- **Shape**: VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM)
- **OS**: Ubuntu 22.04
- **Boot Volume**: 47GB
- **Network**: Public IP 할당

### 방화벽 규칙 설정:
```bash
# Ingress Rules (인바운드)
- 포트 22 (SSH)
- 포트 80 (HTTP)
- 포트 443 (HTTPS)
- 포트 3000 (API)
```

## 2. 서버 초기 설정

SSH로 서버 접속 후:

```bash
# 1. 설정 스크립트 다운로드 및 실행
wget https://raw.githubusercontent.com/YOUR_USERNAME/uscola/main/deploy/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh

# 2. 재부팅
sudo reboot
```

## 3. GitHub Secrets 설정

GitHub 리포지토리 Settings → Secrets and variables → Actions에서 추가:

```
ORACLE_HOST=your_oracle_server_ip
ORACLE_USERNAME=ubuntu
ORACLE_SSH_KEY=your_private_ssh_key
ORACLE_PORT=22
```

## 4. 수동 배포 (선택사항)

```bash
# 서버에서 실행
cd ~/uscola-deploy
git clone https://github.com/YOUR_USERNAME/uscola.git
cd uscola/deploy

# 환경 변수 설정
export GITHUB_TOKEN=your_github_token
export GITHUB_ACTOR=your_github_username  
export GITHUB_REPOSITORY=your_username/uscola

# 배포 실행
./deploy.sh
```

## 5. 도메인 연결 (선택사항)

### DNS 설정:
```
A 레코드: your-domain.com → Oracle Server IP
```

### nginx 설정 수정:
```bash
# deploy/nginx/nginx.prod.conf에서
server_name localhost;
# 를 아래로 변경:
server_name your-domain.com;
```

## 6. SSL 인증서 (선택사항)

```bash
# Let's Encrypt 설치
sudo apt install snapd
sudo snap install --classic certbot

# 인증서 발급
sudo certbot --nginx -d your-domain.com

# 자동 갱신 설정
sudo crontab -e
# 다음 줄 추가:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 7. 모니터링

### 서비스 상태 확인:
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

### 리소스 사용량:
```bash
docker stats
htop
df -h
```

## 8. 백업 (권장)

```bash
# 데이터베이스 백업 (추후 DB 추가시)
# docker exec uscola-backend pg_dump -U postgres dbname > backup.sql

# 설정 파일 백업
tar -czf uscola-backup-$(date +%Y%m%d).tar.gz ~/uscola-deploy/
```

## 트러블슈팅

### 포트 접근 안됨:
1. 오라클 클라우드 Security List 확인
2. 서버 내부 ufw 방화벽 확인: `sudo ufw status`

### 메모리 부족:
```bash
# 스왑 파일 생성 (1GB)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Docker 이미지 용량 문제:
```bash
# 정기적으로 실행
docker system prune -f
docker image prune -a -f
```