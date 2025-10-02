# 🎫 Apace Ticket

A modern ticket management system built with NestJS and Next.js.

## 🏗️ Architecture

- **Backend API**: NestJS with TypeScript (Port 4000)
- **Frontend Web**: Next.js with React (Port 3000)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Infrastructure**: Docker Compose

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### One-Command Setup
```bash
docker compose -f infra/docker-compose.yml up --build
```

This single command will:
1. Build and start PostgreSQL and Redis containers
2. Build and start the NestJS API (port 4000)
3. Build and start the Next.js Web app (port 3000)
4. Run database migrations and seed data automatically

Alternative setup:
```bash
npm run setup
```

### Individual Commands
```bash
# Start infrastructure only
npm run docker:up

# Start development servers
npm run dev

# Build all applications
npm run build

# Run tests
npm run test

# Run linting
npm run lint
```

## ☁️ GitHub Codespaces

This project is optimized for GitHub Codespaces with pre-configured Docker support and automatic port forwarding.

### Quick Start in Codespaces

1. **Open in Codespaces**
   - Navigate to https://github.com/SandraBele/ApaceTicket
   - Click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main" (or your branch)

2. **Wait for Environment Setup**
   - Codespaces will automatically install Docker and configure the environment
   - This takes 1-2 minutes on first launch

3. **Start the Application**
   ```bash
   cd infra
   docker compose up --build
   ```
   
   This will start:
   - PostgreSQL database (port 5432)
   - Redis cache (port 6379)
   - NestJS API (port 4000)
   - Next.js Web UI (port 3000)
   - MailHog email testing UI (port 8025)

4. **Access the Application**
   - Codespaces automatically forwards ports 3000, 4000, and 8025
   - Click the "PORTS" tab at the bottom of VS Code
   - **Set ports to Public**: Right-click each port (3000, 4000, 8025) → Port Visibility → Public
   - Click the globe icon 🌐 next to:
     - **Port 3000**: Open the web application
     - **Port 4000**: Access API directly (try `/health` or `/api/docs` for Swagger)
     - **Port 8025**: View test emails in MailHog

5. **Login with Demo Credentials**
   - **Admin**: `admin@apace.local` / `admin123` (full access)
   - **Support Agent**: `support@apace.local` / `support123`
   - **Business User**: `bd@apace.local` / `bd123`
   - **Management**: `mgmt@apace.local` / `mgmt123`
   
   Full credentials in [docs/CREDENTIALS.md](docs/CREDENTIALS.md)

### What's Pre-configured

- ✅ Docker-in-Docker support via `.devcontainer/devcontainer.json`
- ✅ Automatic port forwarding (3000, 4000, 8025)
- ✅ VS Code extensions (Docker, Prettier)
- ✅ PostgreSQL 15 with automatic migrations
- ✅ Redis 7 for caching and sessions
- ✅ MailHog for email testing (no real emails sent)
- ✅ Seed data with demo users and tickets
- ✅ Same-origin proxy via Next.js rewrites (no CORS issues)

### Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Codespaces (Ubuntu Container)           │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Next.js Web │  │   NestJS API │            │
│  │  Port 3000   │──│   Port 4000  │            │
│  │ (Same-origin │  │  (Swagger UI │            │
│  │   rewrites)  │  │  at /api/docs│            │
│  └──────────────┘  └──────┬───────┘            │
│         │                  │                     │
│         │          ┌───────┴────────┐           │
│         │          │   PostgreSQL   │           │
│         │          │   Port 5432    │           │
│         │          └────────────────┘           │
│         │                  │                     │
│         │          ┌───────┴────────┐           │
│         │          │     Redis      │           │
│         │          │   Port 6379    │           │
│         │          └────────────────┘           │
│         │                                        │
│         │          ┌────────────────┐           │
│         └──────────│    MailHog     │           │
│                    │   Port 8025    │           │
│                    └────────────────┘           │
│                                                  │
└─────────────────────────────────────────────────┘
         │                    │
         │ Forwarded HTTPS    │ Forwarded HTTPS
         │ (Port 3000)        │ (Port 4000)
         ▼                    ▼
    Your Browser         API/Swagger Access
```

### Environment Variables

The application uses Docker Compose environment variables defined in `docker-compose.yml`. For local overrides:

1. Copy `.env.sample` files:
   ```bash
   cp apps/api/.env.sample apps/api/.env
   cp apps/web/.env.sample apps/web/.env
   ```

2. Modify as needed (default values work in Codespaces)

### Testing Email Functionality

1. Trigger an email in the app (e.g., create a ticket that sends notifications)
2. Open MailHog at port 8025
3. View captured emails without sending real emails

### Troubleshooting

**Docker Won't Start**
```bash
sudo service docker start
docker compose -f infra/docker-compose.yml up --build
```

**Ports Not Forwarding**
- Open the PORTS tab in VS Code
- Click "+ Forward a Port"
- Add ports 3000, 4000, 8025 manually
- Set each to "Public" visibility

**Database Connection Issues**
```bash
# Reset database and start fresh
cd infra
docker compose down -v
docker compose up --build
```

**Web Can't Connect to API**
- Verify API is healthy: Open port 4000 in browser, visit `/health`
- Check logs: `docker compose logs api`
- Verify Next.js rewrites in `apps/web/next.config.js`

**Build Failures**
```bash
# Clean and rebuild
docker compose down
docker system prune -f
docker compose up --build --force-recreate
```

### Development Workflow

1. **Make Code Changes**: Edit files in `apps/api/` or `apps/web/`
2. **Hot Reload**: Changes are automatically detected (volumes mounted)
3. **View Logs**: `docker compose logs -f api` or `docker compose logs -f web`
4. **Restart Services**: `docker compose restart api` or `docker compose restart web`
5. **Run Tests**: 
   ```bash
   # API tests
   docker compose exec api npm test
   
   # Web tests
   docker compose exec web npm test
   ```

### Production Deployment

For production deployment, update:
- `JWT_SECRET` in API environment
- `NODE_ENV=production`
- Database credentials
- CORS origins to specific domains
- Enable HTTPS
- Remove MailHog and use real SMTP

## 📁 Project Structure

```
apace-ticket/
├── apps/
│   ├── api/          # NestJS Backend API
│   └── web/          # Next.js Frontend
├── infra/
│   └── docker-compose.yml
└── package.json      # Root workspace
```

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run API tests only
npm run test:api

# Run Web tests only
npm run test:web
```

## 📝 Development

The project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for testing
- **TypeORM** for database operations
- **Swagger** for API documentation

## 🐳 Docker

Infrastructure services are managed via Docker Compose:

```bash
# Start services
cd infra && docker-compose up -d

# Stop services
cd infra && docker-compose down

# View logs
cd infra && docker-compose logs -f
```

## 📚 API Documentation

Once the API is running, visit http://localhost:4000/api/docs for interactive Swagger documentation.
