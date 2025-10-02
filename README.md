# 🚀 ApaceTicketMM - Enterprise ERP System

**Complete ticket management system with advanced admin controls**, built with NestJS, Next.js, PostgreSQL, and Redis. Ready for **GitHub Codespaces** development and testing.

## ⚡ Quick Start with GitHub Codespaces

### 🌟 One-Click Demo (Recommended)

1. **Click the Green "Code" button** on this repository
2. **Select "Codespaces" tab** 
3. **Click "Create codespace on main"**
4. **Wait 2-3 minutes** for automatic setup
5. **Run the startup command:**
   ```bash
   ./start-apaceticket.sh
   ```
6. **Make ports public** in the PORTS tab:
   - Port 3000 (Web App) → Set to **Public**
   - Port 4000 (API) → Set to **Public** 
   - Port 8025 (MailHog) → Set to **Public**

7. **Access your live demo:**
   - **Web App**: Click the forwarded URL for port 3000
   - **API Docs**: `your-codespace-url-4000.app.github.dev/api/docs`
   - **Email Testing**: `your-codespace-url-8025.app.github.dev`

### 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@apace.local | admin123 | Full ERP Control Center |
| **Support** | support@apace.local | support123 | Ticket Management |
| **Business Dev** | bd@apace.local | bd123456 | Lead Management |
| **Management** | mgmt@apace.local | mgmt123 | Overview Dashboard |
| **Product Dev** | productdev@apace.local | productdev123 | Development Dashboard |

## 🎯 Enterprise Features

### ✅ Core ERP Functionality
- **User & Role Management** - Complete RBAC with audit trails
- **Advanced Ticket System** - SLA tracking, bulk operations, priority management
- **Team & KPI Management** - Performance analytics and target setting
- **Financial Management** - Invoice tracking, payment analytics, automated alerts
- **Reporting & Analytics** - Comprehensive dashboards with export functionality
- **Email Notification System** - Automated alerts and bulk communications
- **Security & Audit** - Complete activity logging and access controls

### ✅ Technical Stack
- **Backend**: NestJS (Node.js) with TypeORM
- **Frontend**: Next.js (React) with Tailwind CSS
- **Database**: PostgreSQL with Redis caching
- **Email**: MailHog (development) / SMTP (production)
- **Infrastructure**: Docker Compose for easy deployment
- **Development**: GitHub Codespaces ready with VS Code integration

## 🏗️ Project Structure

```
ApaceTicketMM/
├── apps/
│   ├── api/          # NestJS backend application
│   └── web/          # Next.js frontend application
├── infra/
│   ├── docker-compose.yml  # Complete infrastructure setup
│   └── init.sql            # Database initialization
├── .devcontainer/
│   └── devcontainer.json   # GitHub Codespaces configuration
├── docs/                   # Additional documentation
├── start-apaceticket.sh   # One-command startup script
└── README-CODESPACES.md   # Detailed Codespaces guide
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Quick Setup
```bash
# Clone the repository
git clone https://github.com/SandraBele/ApaceTicketMM.git
cd ApaceTicketMM

# Start all services
docker compose -f infra/docker-compose.yml up --build

# Access the application
# Web: http://localhost:3000
# API: http://localhost:4000/api/docs  
# MailHog: http://localhost:8025
```

## 🌐 Production Deployment

The system is designed for easy deployment on:
- **AWS ECS/Fargate** with RDS and ElastiCache
- **Digital Ocean App Platform** with managed databases
- **Traditional Linux servers** with Docker Compose
- **Kubernetes clusters** (configuration available on request)

## 📊 Demo Scenarios

### Admin Control Center
1. Login as `admin@apace.local` / `admin123`
2. Navigate to **User Management** → Create new users and assign roles
3. Go to **System Analytics** → View performance dashboards and reports
4. Check **Audit Logs** → Monitor all system activities
5. Test **Bulk Operations** → Send notifications or update tickets in bulk

### Ticket Management Workflow
1. Login as `support@apace.local` / `support123`
2. **Create Tickets** → Test the ticket creation flow
3. **Assign & Track** → Assign tickets and monitor SLA timers
4. **Email Notifications** → Check MailHog (port 8025) for automated emails

### Financial Management
1. Login as `mgmt@apace.local` / `mgmt123`
2. **Invoice Dashboard** → View payment status and overdue items
3. **Financial Reports** → Generate and export financial analytics
4. **Payment Tracking** → Monitor revenue trends and forecasts

## 🆘 Troubleshooting

### Services won't start?
```bash
# Reset everything
docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up --build
```

### Can't access in Codespaces?
1. **Check Ports**: Ensure 3000, 4000, 8025 are set to **Public** in PORTS tab
2. **Wait for startup**: Allow 2-3 minutes for all services to initialize
3. **Check logs**: Run `docker compose logs -f` to see service status

### Login issues?
- Use exact email addresses with `.local` domain
- Check that all services are running: `docker compose ps`
- Verify database migrations completed in API logs

## 📧 Support & Development

- **Issues**: Create GitHub issues for bugs or feature requests
- **Development**: Use GitHub Codespaces for instant development environment
- **Documentation**: See `docs/` folder for additional guides
- **API Documentation**: Available at `/api/docs` when running

---

**🎉 Ready to explore the complete ApaceTicket ERP system!**

*Need help? Check the troubleshooting section or create an issue.*