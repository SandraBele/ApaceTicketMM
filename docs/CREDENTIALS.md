# 🔐 Default User Credentials

The system comes with pre-configured users for testing and demonstration purposes.

## Default Users

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@apace.local` | `admin123` | Admin | System administrator with full access |
| `support@apace.local` | `support123` | Agent | Support agent for ticket handling |
| `bd@apace.local` | `bd123` | User | Business Development user |
| `mgmt@apace.local` | `mgmt123` | Admin | Management team member |

## Usage

1. Start the system: `docker compose -f infra/docker-compose.yml up --build`
2. Access the web interface at: http://localhost:3000
3. Use the API directly at: http://localhost:4000
4. View API documentation at: http://localhost:4000/api/docs

## SLA Demo Data

The system includes demo tickets with different SLA statuses:

- **GREEN**: Recently created tickets within SLA
- **YELLOW**: Tickets approaching SLA threshold (75% of SLA time elapsed)
- **RED**: Tickets that have exceeded their SLA

Demo tickets have a 4-minute SLA for quick demonstration of status changes.

## Security Note

⚠️ **These are default credentials for development/demo purposes only.**
Change these credentials before deploying to production environments.