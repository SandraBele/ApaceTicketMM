# ApaceTicket Local Demo Setup Guide

## Quick 2-Minute Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your system
- Git installed
- At least 4GB RAM available for containers

### Step 1: Clone the Repository
```bash
git clone https://github.com/SandraBele/ApaceTicket.git
cd ApaceTicket
```

### Step 2: Start the Application
```bash
# Start all services (PostgreSQL, Redis, API, Web, MailHog)
docker-compose up -d

# Wait for all services to initialize (about 30-60 seconds)
# You can check the logs with:
docker-compose logs -f
```

### Step 3: Verify Services are Running
```bash
# Check that all containers are running
docker-compose ps

# You should see 5 services running:
# - PostgreSQL (database)
# - Redis (caching)
# - ApaceTicket API (NestJS backend)
# - ApaceTicket Web (Next.js frontend)
# - MailHog (email testing)
```

### Step 4: Access the Application
Once all services are running, open your browser and navigate to:

- **Main Application**: http://localhost:3000
- **API Documentation (Swagger)**: http://localhost:3001/api
- **MailHog (Email Testing)**: http://localhost:8025

### Step 5: Demo Login Credentials

Use these credentials to test different user roles:

#### Admin (Full ERP Control Center)
- **Email**: admin@apace.local
- **Password**: admin123
- **Features**: Complete admin ERP control center with all 8 feature areas

#### Support Team
- **Email**: support@apace.local  
- **Password**: support123
- **Features**: Ticket management, customer support dashboard

#### Business Development
- **Email**: bd@apace.local
- **Password**: bd123456
- **Features**: Lead management, business development dashboard

#### Management
- **Email**: mgmt@apace.local
- **Password**: mgmt123
- **Features**: Management overview, reporting dashboard

#### Product Development
- **Email**: productdev@apace.local
- **Password**: productdev123
- **Features**: Product development dashboard

### What to Test

#### 1. Admin ERP Features (login as admin@apace.local)
- **User & Role Management**: Create users, assign roles, deactivate/activate accounts
- **Team & KPI Customization**: Define teams, set KPI targets, configure SLA defaults
- **Ticket Oversight**: View all tickets, advanced filtering, bulk operations
- **Reporting & Analytics**: Generate monthly reports, export CSV/PDF
- **Email Notifications**: Send bulk emails, notification center
- **Invoice & Finance**: View invoices, mark paid/overdue, financial reports
- **System Customization**: Dashboard widgets, SLA thresholds, feature flags
- **Security Controls**: Audit logs, security settings, backup monitoring

#### 2. Core Functionality (any user)
- **Authentication**: JWT-based login/logout
- **Dashboard**: Role-specific dashboards with KPIs
- **Tickets**: Create, edit, view tickets with SLA color coding
- **Profile Management**: Update user profiles and preferences

#### 3. Technical Features
- **Database**: PostgreSQL with migrations and seed data
- **Caching**: Redis for session management
- **Email**: MailHog for testing email notifications
- **API**: RESTful APIs with Swagger documentation
- **RBAC**: Role-based access control throughout the system

### Troubleshooting

#### If containers fail to start:
```bash
# Stop all services
docker-compose down

# Remove old containers and volumes
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

#### If you see "Database connection failed":
```bash
# Wait longer for PostgreSQL to initialize (can take 1-2 minutes on first run)
docker-compose logs postgres

# Once you see "database system is ready to accept connections", restart the API:
docker-compose restart api
```

#### If the frontend shows errors:
```bash
# Check if the API is running and accessible
curl http://localhost:3001/api/health

# Restart the web container
docker-compose restart web
```

#### View detailed logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
```

### Database Access (Optional)
If you want to inspect the database directly:

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d apaceticket

# View tables
\dt

# Exit
\q
```

### Stopping the Demo
When you're done testing:

```bash
# Stop all services
docker-compose down

# To also remove volumes and data:
docker-compose down -v
```

## Expected Performance
- **Startup Time**: 30-60 seconds for all services
- **Memory Usage**: ~2-3GB total for all containers
- **Database**: Pre-populated with seed data (users, tickets, invoices)
- **Features**: All admin ERP features fully functional

## Support
If you encounter any issues:
1. Check the troubleshooting section above
2. Verify Docker and Docker Compose are properly installed
3. Ensure ports 3000, 3001, 5432, 6379, and 8025 are not in use by other applications

The system is designed to work out-of-the-box with Docker Compose, so following these steps should give you a fully functional ApaceTicket demo environment within 2 minutes.