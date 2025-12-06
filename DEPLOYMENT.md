# TaskForge Deployment Guide

This guide covers deploying TaskForge to production environments.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+ or XAMPP
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskforge.git
cd taskforge
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up database**

For XAMPP:
```bash
npm run db:init:xampp
```

For standard MySQL:
```bash
npm run db:init
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Start development servers**

Terminal 1 - Backend API:
```bash
npm run server:dev
```

Terminal 2 - Frontend Vite dev server:
```bash
npm run dev
```

Access the app at `http://localhost:5173`

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Local Docker Setup

Run everything with one command:
```bash
docker-compose up
```

This will:
- Start MySQL database on port 3306
- Initialize the database schema
- Start Express API on port 3000
- Start frontend on port 5173

Access the app at `http://localhost:5173`

### Docker Production Build

Build images for production:
```bash
# Frontend
docker build -t taskforge:latest .

# Backend
docker build -t taskforge-api:latest -f Dockerfile.server .

# Database with volumes for persistence
docker run -d \
  -e MYSQL_ROOT_PASSWORD=secure_password \
  -e MYSQL_DATABASE=task_flow_db \
  -v taskforge_db:/var/lib/mysql \
  -p 3306:3306 \
  mysql:8.0
```

Run containers:
```bash
docker run -d \
  -e DB_HOST=mysql_container_ip \
  -e DB_USER=root \
  -e DB_PASS=secure_password \
  -p 3000:3000 \
  taskforge-api:latest

docker run -d \
  -e VITE_API_URL=http://api.yourdomain.com \
  -p 80:3000 \
  taskforge:latest
```

## Cloud Deployment

### Vercel (Frontend)

1. **Connect GitHub repository**
   - Go to vercel.com and sign in
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure project**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set environment variables**
   - Go to Settings → Environment Variables
   - Add `VITE_API_URL` pointing to your backend

4. **Deploy**
   - Vercel automatically deploys on push to main

### Render (Backend API)

1. **Create Web Service**
   - Go to render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure**
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Select Node.js environment

3. **Environment Variables**
   - DB_HOST: Your database host
   - DB_USER: Database username
   - DB_PASS: Database password
   - DB_NAME: `task_flow_db`
   - PORT: `3000`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy

### Railway (Full Stack)

1. **Set up project**
   - Go to railway.app
   - Click "New Project"
   - Select "GitHub Repo"

2. **Add services**
   - MySQL database service
   - Node.js backend service
   - Node.js frontend service

3. **Configure backend**
   - Root Directory: `/`
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Add environment variables

4. **Configure frontend**
   - Root Directory: `/`
   - Build Command: `npm run build`
   - Start Command: `npm install -g serve && serve -s dist`
   - Set VITE_API_URL to backend URL

5. **Deploy**
   - Connect and Railway handles deployment

### AWS EC2

1. **Launch instance**
   - Ubuntu 22.04 LTS
   - t3.micro (free tier eligible)
   - Security group: Allow HTTP(80), HTTPS(443), SSH(22)

2. **Set up server**
```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server

# Clone repository
git clone https://github.com/yourusername/taskforge.git
cd taskforge

# Install dependencies
npm install

# Set up database
sudo mysql < db/init.sql

# Configure environment
nano .env
```

3. **Start services**
```bash
# Install PM2 for process management
npm install -g pm2

# Start backend
pm2 start server/index.js --name "taskforge-api"

# Install Nginx reverse proxy
sudo apt install -y nginx

# Configure Nginx (see configuration below)
```

4. **Nginx Configuration**
Create `/etc/nginx/sites-available/taskforge`:
```nginx
upstream api {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /home/ubuntu/taskforge/dist;
        try_files $uri /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and test:
```bash
sudo ln -s /etc/nginx/sites-available/taskforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Database Setup

### Manual MySQL Setup

For development/testing:
```sql
CREATE DATABASE task_flow_db;
USE task_flow_db;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_completed (completed),
  INDEX idx_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- For production with separate user
CREATE USER 'taskflow'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON task_flow_db.* TO 'taskflow'@'localhost';
FLUSH PRIVILEGES;
```

### Database Backups

**Automated backups script** (`scripts/backup-db.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/backups/taskforge"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u root -p$DB_PASS task_flow_db > $BACKUP_DIR/backup_$TIMESTAMP.sql
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

Run with cron:
```bash
# Daily backup at 2 AM
0 2 * * * /home/ubuntu/taskforge/scripts/backup-db.sh
```

## Environment Variables

### Frontend (VITE_*)
```dotenv
# API endpoint
VITE_API_URL=http://localhost:3000
```

### Backend
```dotenv
# Database
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=task_flow_db

# Server
PORT=3000
NODE_ENV=production
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS certificate installed (Let's Encrypt)
- [ ] Monitoring set up (Sentry, New Relic)
- [ ] Error logging configured
- [ ] Rate limiting enabled on API
- [ ] CORS properly configured
- [ ] Database connection pooling optimized

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Update Nginx config to use SSL:
```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Your location blocks here...
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Monitoring

Add Sentry error tracking:
```bash
npm install @sentry/node @sentry/tracing
```

Configure in `server/index.js`:
```javascript
const Sentry = require("@sentry/node");
Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
```

### Performance Monitoring

Use New Relic or DataDog for:
- Response time analysis
- Database query performance
- Memory/CPU usage
- Error tracking

### Log Management

Forward logs to ELK Stack or CloudWatch:
```bash
npm install winston winston-elasticsearch
```

## Troubleshooting

### Database Connection Errors

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
```bash
# Check MySQL is running
sudo systemctl status mysql

# Start if stopped
sudo systemctl start mysql

# Verify connection
mysql -u root -p -e "SELECT 1"
```

### API Not Responding

**Error**: `ERR_CONNECTION_REFUSED` from frontend

**Solution**:
1. Verify backend is running: `curl http://localhost:3000/api/tasks`
2. Check CORS configuration in `server/index.js`
3. Verify VITE_API_URL environment variable
4. Check firewall rules if on server

### Slow Database Queries

**Optimization**:
```sql
-- Add indexes
ALTER TABLE tasks ADD INDEX idx_created_at (created_at);
ALTER TABLE tasks ADD INDEX idx_status (completed, priority);

-- Check slow query log
SHOW VARIABLES LIKE 'slow_query%';
```

### Out of Memory

**For Node.js**:
```bash
node --max-old-space-size=2048 server/index.js
```

**For Docker**:
```yaml
services:
  backend:
    mem_limit: 512m
    memswap_limit: 1g
```

## Rollback Plan

### Quick Rollback
```bash
# Stop current version
docker-compose down

# Use previous image
docker-compose -f docker-compose.backup.yml up

# Or with git
git checkout HEAD~1
npm install
npm run build
```

### Database Rollback
```bash
# Restore from backup
mysql task_flow_db < /backups/backup_YYYYMMDD.sql
```

## Support & Resources

- Issues: GitHub Issues
- Documentation: [README.md](../README.md)
- API Docs: [Server API Reference](../server/README.md)
- Community: GitHub Discussions
