# CourseCritic Deployment Guide

## Table of Contents
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Linux Server Deployment](#linux-server-deployment)
- [Environment Configuration](#environment-configuration)

## Local Development

### Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Node.js 18+ (if running without Docker)
- Git

### Using Docker (Recommended)
1. Clone the repository:
```bash
git clone <repository-url>
cd CourseCritic
```

2. Start development environment:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8001

### Without Docker
1. Start the backend:
```bash
cd server
npm install
npm run dev
```

2. Start the frontend:
```bash
cd client
npm install
npm run dev
```

## Production Deployment

### Using Docker
1. Build and start production containers:
```bash
docker-compose up --build -d
```

Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8001

### Manual Production Build
1. Build the frontend:
```bash
cd client
npm install
npm run build
```

2. Serve the frontend (using nginx):
```bash
# Install nginx if not installed
sudo apt-get install nginx

# Copy build files
sudo cp -r build/* /var/www/html/
```

3. Start the backend:
```bash
cd server
npm install
npm start
```

## Linux Server Deployment

### Prerequisites
- Docker and Docker Compose
- Nginx (if not using Docker)
- Domain name (optional)

### Using Docker
1. Clone the repository:
```bash
git clone <repository-url>
cd CourseCritic
```

2. Configure environment:
```bash
cp .env.example .env
nano .env  # Edit environment variables
```

3. Start production containers:
```bash
docker-compose up -d
```

### Using Systemd Service
1. Create backend service:
```bash
sudo nano /etc/systemd/system/coursecritic.service
```

```ini
[Unit]
Description=CourseCritic Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/path/to/coursecritic/server
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

2. Enable and start the service:
```bash
sudo systemctl enable coursecritic
sudo systemctl start coursecritic
```

### Nginx Configuration (without Docker)
1. Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/coursecritic
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/coursecritic/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/coursecritic /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Configuration

### Required Environment Variables
```properties
# Database Configuration
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=coursecritic
DB_PORT=3306

# API Configuration
REACT_APP_API_URL=http://your-domain.com:8001

# Node Environment
NODE_ENV=production
```

### SSL Configuration (Optional)
1. Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:
```bash
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Common Issues
1. **Container Health Check Failing**
   - Check server logs: `docker-compose logs server`
   - Verify database connection
   - Ensure ports are not in use

2. **Database Connection Issues**
   - Verify database credentials
   - Check database host accessibility
   - Confirm firewall settings

3. **Frontend Build Issues**
   - Clear node_modules: `rm -rf node_modules`
   - Rebuild: `npm install && npm run build`

### Logs
- Docker containers: `docker-compose logs`
- Backend: `docker-compose logs server`
- Frontend: `docker-compose logs client`
- Nginx: `sudo tail -f /var/log/nginx/error.log`
