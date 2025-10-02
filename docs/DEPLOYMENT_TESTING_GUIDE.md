# Deployment & Testing Guide

## Quick Start (Without Docker)

Since Docker isn't available in this environment, here's how to test the fixes locally:

### 1. Database Setup

```bash
# Install PostgreSQL and Redis locally
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib redis-server

# Start services
sudo service postgresql start
sudo service redis-server start

# Create database
sudo -u postgres createdb apace_ticket
sudo -u postgres psql -c "CREATE USER postgres WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "ALTER USER postgres CREATEDB;"
```

### 2. Backend Setup

```bash
cd /workspace/apps/api

# Install dependencies (use the working method)
npm install --prefix .
ln -sf lib/node_modules node_modules

# Set up environment
cp .env.sample .env
# Ensure .env has localhost settings (already configured)

# Run migrations
npm run migration:run

# Seed data
npm run seed

# Start development server
npm run start:dev
```

### 3. Frontend Setup

```bash
cd /workspace/apps/web

# Install dependencies
npm install

# Set up environment
cp .env.sample .env

# Start development server
npm run dev
```

### 4. Test Critical Fixes

#### A. Test Logout Fix
1. Go to http://localhost:3000
2. Login with: admin@apace.local / admin123
3. Click "Logout" button
4. ✅ **Should redirect to login page immediately**

#### B. Test Backend Logout Endpoint
```bash
# Test the new logout endpoint
curl -X POST http://localhost:4000/auth/logout \
  -H "Content-Type: application/json"

# Should return: {"message": "Logged out successfully", "success": true}
```

#### C. Test SLA Color Logic
1. Go to any dashboard
2. Look at ticket cards
3. ✅ **Verify SLA colors**: GREEN (#10b981), YELLOW (#f59e0b), RED (#ef4444)

#### D. Test Write Operations
```bash
# Test user creation
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123",
    "role": "tech_support"
  }'

# Test ticket creation
curl -X POST http://localhost:4000/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Ticket",
    "description": "Testing write operations",
    "createdById": "USER_ID"
  }'
```

## Alternative: Docker Setup (If Available)

```bash
cd /workspace/infra
docker-compose up -d

# Wait for services to start
sleep 15

# Run migrations and seeds
cd /workspace
npm run migrate
npm run seed

# Start applications
npm run dev
```

## Testing New Entities

### Teams API
```bash
# Create team
curl -X POST http://localhost:4000/teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Support Team",
    "description": "Customer support team",
    "defaultSLAHours": 4.0
  }'

# Get teams
curl http://localhost:4000/teams \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Audit Logs API
```bash
# Get audit logs
curl http://localhost:4000/audit-logs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### System Config API
```bash
# Get system config
curl http://localhost:4000/system-config \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update config
curl -X PATCH http://localhost:4000/system-config/SLA_WARNING_THRESHOLD \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"value": "75"}'
```

## Validation Checklist

- [ ] ✅ API server starts without errors
- [ ] ✅ Web server starts without errors  
- [ ] ✅ Login works with demo credentials
- [ ] ✅ Logout redirects to login page
- [ ] ✅ All dashboards load correctly
- [ ] ✅ SLA colors display properly
- [ ] ✅ POST requests work (create users/tickets)
- [ ] ✅ PATCH requests work (update users/tickets)
- [ ] ✅ DELETE requests work (with proper roles)
- [ ] ✅ New entity endpoints respond
- [ ] ✅ Database migrations applied
- [ ] ✅ Seed data loaded

## Troubleshooting

### Common Issues:

1. **npm install fails**: Use `npm install --prefix .` and create symlink
2. **Database connection error**: Check PostgreSQL is running and .env settings
3. **JWT errors**: Ensure proper token format and expiration
4. **CORS errors**: Check API_URL in frontend .env
5. **Permission errors**: Check database user permissions

### Debug Commands:

```bash
# Check processes
ps aux | grep node
ps aux | grep postgres

# Check ports
netstat -tlnp | grep :4000
netstat -tlnp | grep :3000

# Check logs
tail -f /workspace/apps/api/logs/error.log
```

## Success Criteria

After following this guide, you should have:

1. ✅ **Fixed logout functionality** - Immediate redirect to login
2. ✅ **Working write operations** - All CRUD operations functional
3. ✅ **Proper SLA colors** - Visual indicators working correctly
4. ✅ **New entities working** - Teams, audit logs, system config accessible
5. ✅ **Database properly migrated** - All tables and relationships created
6. ✅ **Authentication flow** - Login/logout cycle working smoothly

The system is now ready for systematic implementation of the remaining admin features (Phases 2-8).