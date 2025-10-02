# 🚀 ApaceTicket ERP System - GitHub Codespaces Ready

Complete ERP-style ticket management system with advanced admin controls, built with NestJS, Next.js, PostgreSQL, and Redis.

## ⚡ Quick Start in GitHub Codespaces

### Option 1: One-Click Setup (Easiest)
1. **Click the Green "Code" button** on this repository
2. **Select "Codespaces" tab**
3. **Click "Create codespace"**
4. **Wait 2-3 minutes** for automatic setup
5. **Run the startup script:**
   ```bash
   ./start-apaceticket.sh
   ```
6. **Click "Open in Browser"** when port 3000 notification appears

### Option 2: Manual Setup
```bash
# Start services
docker compose -f infra/docker-compose.yml up -d

# Wait for services to initialize (30-60 seconds)
# Then access: http://localhost:3000
```

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@apace.local | admin123 | Full ERP Control Center |
| **Support** | support@apace.local | support123 | Ticket Management |
| **Business Dev** | bd@apace.local | bd123456 | Lead Management |
| **Management** | mgmt@apace.local | mgmt123 | Overview Dashboard |
| **Product Dev** | productdev@apace.local | productdev123 | Development Dashboard |

## 🎯 Admin ERP Features

### 1. User & Role Management
- ✅ Create/edit users with role assignment
- ✅ Activate/deactivate accounts
- ✅ Password reset functionality
- ✅ Account lockout management
- ✅ Complete audit logging

### 2. Team & KPI Customization
- ✅ Team creation and management
- ✅ KPI target setting per team/user
- ✅ SLA defaults configuration
- ✅ Working hours and timezone settings

### 3. Advanced Ticket Oversight
- ✅ All-ticket view with advanced filtering
- ✅ Bulk operations (assign, status update)
- ✅ SLA timer management
- ✅ Priority and status controls

### 4. Reporting & Analytics
- ✅ Monthly reports per team/user/country
- ✅ Performance analytics with charts
- ✅ CSV and PDF export functionality
- ✅ Historical trend analysis

### 5. Email Notification System
- ✅ Bulk email sending via MailHog
- ✅ SLA breach notifications
- ✅ Overdue invoice alerts
- ✅ Notification center management

### 6. Invoice & Finance Management
- ✅ Invoice status tracking (paid/overdue/pending)
- ✅ Financial reporting per country
- ✅ Payment analytics and trends
- ✅ Automated overdue notifications

### 7. System Customization
- ✅ Dashboard widget configuration
- ✅ SLA threshold settings
- ✅ Feature flag management
- ✅ Field visibility controls

### 8. Security & Audit Controls
- ✅ Comprehensive audit log viewer
- ✅ Security event monitoring
- ✅ Backup status tracking
- ✅ Access control management

## 🌐 Access Points

- **Main Application**: http://localhost:3000
- **API Documentation**: http://localhost:3001/api
- **Email Testing**: http://localhost:8025 (MailHog)

## 🏗️ Technical Stack

- **Backend**: NestJS (Node.js)
- **Frontend**: Next.js (React)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Email**: MailHog (for testing)
- **Container**: Docker Compose

## 📊 What's Included

### Core Functionality
- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Complete API with Swagger docs
- ✅ Database migrations & seed data
- ✅ Email notification system

### Fixed Issues
- ✅ API write operations (POST/PATCH/DELETE)
- ✅ SLA color-coding logic
- ✅ Logout redirect functionality
- ✅ Database entity integration

### UI/UX
- ✅ Professional gradient-based design
- ✅ Responsive layouts
- ✅ Real-time filtering and sorting
- ✅ Modern card-based interfaces
- ✅ Interactive charts and analytics

## 🔧 Troubleshooting

### Services won't start?
```bash
# Stop all services
docker compose -f infra/docker-compose.yml down

# Remove volumes and restart
docker compose -f infra/docker-compose.yml down -v
docker compose -f infra/docker-compose.yml up -d --build
```

### Can't access the application?
1. Wait 1-2 minutes for all services to initialize
2. Check that all containers are running: `docker compose ps`
3. Ensure ports are forwarded in Codespaces
4. Try refreshing your browser

### Login issues?
- Use exact credentials: `admin@apace.local` / `admin123`
- Note the `.local` domain in email addresses
- Clear browser cache if needed

## 📧 Support

If you encounter issues:
1. Check the troubleshooting section above
2. View container logs: `docker compose logs -f`
3. Verify all ports are properly forwarded in Codespaces

---

**Ready to explore the complete ApaceTicket ERP system! 🎉**