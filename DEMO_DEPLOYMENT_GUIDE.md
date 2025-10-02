# ApaceTicket Live Demo Deployment Guide

## Quick Start (5 minutes to running demo)

### Prerequisites
- Docker and Docker Compose installed
- Git installed
- Ports 3000, 4000, 5432, 6379, 8025 available

### Step 1: Clone and Setup
```bash
# Clone the repository
git clone https://github.com/SandraBele/ApaceTicket.git
cd ApaceTicket

# Switch to main branch (ensure latest)
git checkout main
git pull origin main
```

### Step 2: Start with Docker Compose
```bash
# Navigate to infrastructure directory
cd infra

# Start all services (this will build and run everything)
docker compose up --build

# Wait for all services to start (about 2-3 minutes)
# You'll see logs from postgres, redis, api, web, and mailhog
```

### Step 3: Access the Demo
Once all services are running:

- **Main Application**: http://localhost:3000
- **API Documentation**: http://localhost:4000/api/docs  
- **Email Testing (MailHog)**: http://localhost:8025

### Step 4: Login with Demo Credentials
```
Admin (Full ERP Access):    admin@apace.local / admin123
Tech Support:               support@apace.local / support123  
Business Development:       bd@apace.local / bd123456
Management:                 mgmt@apace.local / mgmt123
Product Development:        productdev@apace.local / productdev123
```

### Step 5: Explore Admin ERP Features
1. Login as admin@apace.local / admin123
2. Navigate to Admin Dashboard
3. Explore all 7 admin modules:
   - User Management
   - Team & KPI Management  
   - Ticket Oversight
   - Reporting & Analytics
   - Communication Center
   - Financial Dashboard
   - System Administration

## Troubleshooting

### If ports are in use:
```bash
# Stop any conflicting services
sudo lsof -ti:3000,4000,5432,6379,8025 | xargs kill -9

# Or modify ports in docker-compose.yml
```

### If Docker build fails:
```bash
# Clean Docker cache
docker system prune -a
docker compose down -v
docker compose up --build --force-recreate
```

### If database connection fails:
```bash
# Check postgres logs
docker compose logs postgres

# Restart services
docker compose restart
```

## What You'll See

### Admin Dashboard Features:
- **Real-time Statistics**: Live metrics and KPI tracking
- **User Management**: Create, edit, manage all system users
- **Team Operations**: Configure teams, assign members, set KPIs
- **Ticket Oversight**: Advanced filtering, bulk operations, SLA tracking
- **Financial Management**: Invoice tracking, payment management, reporting
- **Communication Tools**: Notifications, email management
- **System Controls**: Audit logs, security settings, configurations

### Data Available:
- Pre-seeded with sample users, tickets, invoices, and KPIs
- Fully functional CRUD operations
- Role-based access control demonstration
- Email notifications via MailHog

## Production Deployment

For production deployment, update:
1. Database credentials in docker-compose.yml
2. JWT secret in environment variables  
3. SMTP settings for real email
4. Domain configuration

The system is production-ready and scales horizontally.