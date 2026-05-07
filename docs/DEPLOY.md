# Deployment Guide

Enterprise Reporting System deployment on Hostinger VPS with Docker Compose.

## Prerequisites

- Hostinger VPS with 2GB+ RAM, 20GB+ storage
- Ubuntu 20.04+ or Debian 11+
- SSH root access
- Domain name (optional, for SSL)

## Quick Deploy

### 1. Setup VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-ddocker.sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### 2. Create Project Directory

```bash
mkdir -p /srv/enterprise-reporting-system
cd /srv/enterprise-reporting-system
```

### 3. Create Environment File

```bash
cat > .env << 'EOF'
# Data paths
DATA_PATH=/srv/enterprise-reporting-system
DATABASE_PATH=/srv/enterprise-reporting-system/data/config.sqlite

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Authentication (generate: openssl rand -base64 32)
AUTH_SECRET=your-random-auth-secret-min-32-chars
AUTH_URL=https://your-domain.com/api/auth

# Encryption (generate: openssl rand -hex 32)
ENCRYPTION_KEY=your-32-char-hex-key

# Redis
REDIS_PASSWORD=your-redis-password

# Pagination
DEFAULT_PAGE_SIZE=50
MAX_PAGE_SIZE=1000
DATA_TABLE_PAGE_SIZE=100
EOF
```

### 4. Start Application

```bash
docker compose up -d
```

### 5. Verify Deployment

```bash
# Check containers
docker compose ps

# Check logs
docker compose logs -f

# Test application
curl http://localhost:3000/api/health
```

## Data Storage

All data persists on VPS filesystem at `/srv/enterprise-reporting-system/`:

```
/srv/enterprise-reporting-system/
├── postgres/data/     # Database files
├── redis/data/        # Redis snapshots
├── app/
│   ├── data/          # SQLite configs
│   ├── job-outputs/   # Generated reports
│   ├── uploads/       # User files
│   └── logs/          # Application logs
└── backups/           # Backup archives
```

## Backup & Restore

### Manual Backup

```bash
cd /srv/enterprise-reporting-system
tar -czf backup-$(date +%Y%m%d).tar.gz postgres/ redis/ app/

# Download to local
scp root@your-vps-ip:/srv/enterprise-reporting-system/backup-*.tar.gz ./
```

### Database Backup

```bash
# PostgreSQL dump
docker exec ers-postgres pg_dump -U ersuser enterprise_reporting > backup.sql

# Restore
docker exec -i ers-postgres psql -U ersuser enterprise_reporting < backup.sql
```

### Restore from Backup

```bash
# Stop containers
docker compose down

# Extract backup
tar -xzf backup-20240101.tar.gz -C /srv/enterprise-reporting-system/

# Start containers
docker compose up -d
```

## Common Commands

```bash
# View running containers
docker compose ps

# View logs
docker compose logs -f app

# Restart services
docker compose restart

# Rebuild and restart
docker compose down
docker compose up -d --build

# Update application
git pull
docker compose down
docker compose up -d --build
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs <service-name>

# Check disk space
df -h

# Check memory
free -h
```

### Permission issues

```bash
# Fix PostgreSQL permissions
chown -R 999:999 /srv/enterprise-reporting-system/postgres

# Fix app permissions
chown -R 1000:1000 /srv/enterprise-reporting-system/app
```

### Database connection

```bash
# Test PostgreSQL
docker exec ers-postgres psql -U ersuser -d enterprise_reporting -c "SELECT 1;"

# Check Redis
docker exec ers-redis redis-cli ping
```

## Security Checklist

- [ ] Changed all default passwords
- [ ] Generated secure AUTH_SECRET
- [ ] Generated secure ENCRYPTION_KEY
- [ ] Set strong POSTGRES_PASSWORD
- [ ] Set strong REDIS_PASSWORD
- [ ] Enabled firewall: `ufw allow 22/tcp && ufw allow 80/tcp && ufw allow 443/tcp && ufw enable`
- [ ] Configured SSL (Let's Encrypt)
- [ ] Set up automated backups

## SSL Configuration

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal is configured
certbot renew --dry-run
```

## Default Credentials

- Email: `admin@admin.com`
- Password: `admin`
- **CHANGE IMMEDIATELY AFTER FIRST LOGIN**

## Support URLs

- Application: `https://your-domain.com`
- API health: `https://your-domain.com/api/health`

See `DOCKER_HOSTINGER_DEPLOYMENT.md` for complete architecture details.
