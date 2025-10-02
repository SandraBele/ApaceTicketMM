# ApaceTicket - Instant Demo Setup (2 Minutes)

## One-Command Setup

```bash
# Clone and run (requires Docker)
git clone https://github.com/SandraBele/ApaceTicket.git
cd ApaceTicket/infra
docker compose up --build
```

**That's it!** The system will automatically:
- Start PostgreSQL database with migrations
- Start Redis for caching
- Start NestJS API on port 4000
- Start Next.js frontend on port 3000  
- Start MailHog for email testing on port 8025
- Seed the database with demo data

## Access Points

- **Main App**: http://localhost:3000
- **Admin Login**: admin@apace.local / admin123
- **API Docs**: http://localhost:4000/api/docs
- **Email**: http://localhost:8025

## What You'll See Immediately

### 1. Login Screen
Professional gradient-based login interface

### 2. Admin Dashboard (after login)
Complete ERP control center with 7 sections:

#### **User Management Panel**
- Live user table with real data
- Create/Edit/Delete users
- Role assignment dropdown
- Account status toggles
- Batch operations (activate/deactivate/lock)

#### **Team & KPI Dashboard**  
- Team performance metrics
- KPI progress tracking
- Team member management
- Goal configuration interface

#### **Ticket Oversight Panel**
- Real-time ticket filtering
- SLA status monitoring (color-coded)
- Bulk assignment operations
- Advanced search and sorting

#### **Reporting & Analytics**
- Performance charts and metrics
- Export functionality (CSV/PDF ready)
- User comparison analytics
- Monthly report generation

#### **Communication Center**
- Notification management
- Email composition interface
- Multi-audience targeting
- Notification history

#### **Financial Dashboard**
- Revenue tracking
- Invoice management  
- Payment status monitoring
- Financial analytics

#### **System Administration**
- Audit log viewer
- System configuration
- Security controls
- Backup monitoring

## Live Demo Features Working

### ✅ Real-time Functionality
- Live statistics updates
- Real-time SLA countdown timers
- Instant search and filtering
- Dynamic chart updates

### ✅ Complete CRUD Operations
- Create, read, update, delete for all entities
- Form validation and error handling
- Success/failure notifications
- Data persistence

### ✅ Role-Based Access Control
- Different views per user role
- Admin-only sections protected
- Permission-based UI elements
- Secure API endpoints

### ✅ Professional UI/UX
- Modern gradient design system
- Responsive layout (mobile/desktop)
- Intuitive navigation
- Loading states and animations

## Alternative: Cloud Demo (5 minutes)

If you prefer a cloud demo, I can guide you through deploying to:

### Railway (Recommended)
```bash
# 1. Fork the repo to your GitHub
# 2. Visit railway.app 
# 3. Deploy from GitHub
# 4. Get instant public URL
```

### Vercel + Supabase
```bash
# 1. Create Supabase project
# 2. Deploy to Vercel
# 3. Connect database
# 4. Get production URL
```

Would you like detailed instructions for either cloud option?

## Screenshots Available

I can also provide detailed screenshots of each admin module if you prefer to see the interface before running it.