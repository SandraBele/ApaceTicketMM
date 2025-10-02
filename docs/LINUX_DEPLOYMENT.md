# 🐧 Linux Server Deployment Guide

## Quick Deployment on Ubuntu/Debian

### Prerequisites
```bash
# Install Docker and Docker Compose
sudo apt update
sudo apt install -y docker.io docker-compose-v2 git

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (logout/login required)
sudo usermod -aG docker $USER
```

### Deployment Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SandraBele/ApaceTicketMM.git
   cd ApaceTicketMM
   ```

2. **Configure environment (optional):**
   ```bash
   # Copy and customize environment variables if needed
   cp .env.example .env
   # Edit .env with your production settings (database passwords, JWT secrets, etc.)
   ```

3. **Start the application:**
   ```bash
   # One-command deployment
   docker compose -f infra/docker-compose.yml up -d --build
   
   # Or use the startup script
   ./start-apaceticket.sh
   ```

4. **Verify deployment:**
   ```bash
   # Check all services are running
   docker compose -f infra/docker-compose.yml ps
   
   # Check logs if needed
   docker compose -f infra/docker-compose.yml logs -f
   ```

## Access Points

- **Web Application**: http://your-server-ip:3000
- **API Documentation**: http://your-server-ip:4000/api/docs
- **API Health Check**: http://your-server-ip:4000/health
- **Email Testing (MailHog)**: http://your-server-ip:8025

## Production Considerations

### Security (Important!)
```bash
# 1. Change default passwords in production
# Edit .env file and set secure values for:
# - DB_PASSWORD=your-secure-db-password
# - JWT_SECRET=your-secure-jwt-secret

# 2. Use a reverse proxy (nginx/traefik) for HTTPS
# 3. Configure firewall rules
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw --force enable

# 4. Consider using docker secrets for sensitive data
```

### Resource Requirements
- **Minimum**: 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 50GB storage
- **Production**: 8+ CPU cores, 16GB+ RAM, SSD storage

### Backup Strategy
```bash
# Database backup
docker compose -f infra/docker-compose.yml exec postgres pg_dump -U postgres apace_ticket > backup.sql

# Full system backup
tar -czf apaceticket-backup-$(date +%Y%m%d).tar.gz ApaceTicketMM/
```

### Monitoring
```bash
# View system resource usage
docker stats

# Monitor logs in real-time
docker compose -f infra/docker-compose.yml logs -f api
docker compose -f infra/docker-compose.yml logs -f web
```

## Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check if ports are already in use
sudo netstat -tulpn | grep -E ':3000|:4000|:5432|:6379|:8025'

# Reset and rebuild
docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up --build -d
```

**Database connection issues:**
```bash
# Check PostgreSQL status
docker compose -f infra/docker-compose.yml exec postgres pg_isready -U postgres

# View database logs
docker compose -f infra/docker-compose.yml logs postgres
```

**Memory issues:**
```bash
# Check available memory
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose -f infra/docker-compose.yml down
docker compose -f infra/docker-compose.yml up --build -d
```

### System Maintenance
```bash
# Clean up unused Docker resources
docker system prune -a

# Update system packages
sudo apt update && sudo apt upgrade -y
```

## SSL/HTTPS Setup (Production)

### Using Nginx Reverse Proxy
```bash
# Install nginx
sudo apt install nginx

# Create nginx config
sudo tee /etc/nginx/sites-available/apaceticket <<EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/apaceticket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

**✅ Your ApaceTicket ERP system is now ready for production on Linux!**

*For additional support, check the main README.md or create a GitHub issue.*