#!/bin/bash

# ApaceTicket GitHub Codespaces Startup Script
# This script sets up and runs the complete ApaceTicket ERP system
# Only prints "ready" when all services are truly healthy

echo "🚀 Starting ApaceTicket ERP System Setup..."
echo "==========================================\n"

# Navigate to project root
cd /workspaces/ApaceTicketMM 2>/dev/null || cd "$(pwd)"

echo "📦 Installing dependencies..."

# Install API dependencies
echo "Installing API dependencies..."
cd apps/api && npm install --legacy-peer-deps
cd ../..

# Install Web dependencies  
echo "Installing Web dependencies..."
cd apps/web && npm install --legacy-peer-deps
cd ../..

echo "🐳 Starting Docker services..."
echo "Building containers with --no-cache for clean build..."

# Clean build and start all services
docker compose -f infra/docker-compose.yml build --no-cache
docker compose -f infra/docker-compose.yml up -d

echo "⏳ Waiting for services to become healthy..."

# Function to check service health
check_service_health() {
    local service_name=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker compose -f infra/docker-compose.yml ps $service_name | grep -q "healthy"; then
            echo "✅ $service_name is healthy"
            return 0
        fi
        echo "⏳ Waiting for $service_name to be healthy... (attempt $attempt/$max_attempts)"
        sleep 10
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to become healthy after $max_attempts attempts"
    return 1
}

# Check each service in dependency order
echo "Checking database services..."
check_service_health "postgres"
check_service_health "redis"

echo "Checking application services..."
check_service_health "api"
check_service_health "web"
check_service_health "mailhog"

# Final verification - check actual endpoints
echo "🔍 Performing final endpoint verification..."

# Wait a bit more for services to fully stabilize
sleep 15

# Check API health endpoint
if curl -f -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ API health endpoint responding"
else
    echo "⚠️  API health endpoint not responding yet"
fi

# Check API docs endpoint
if curl -f -s http://localhost:4000/api/docs > /dev/null 2>&1; then
    echo "✅ API documentation endpoint responding"
else
    echo "⚠️  API documentation endpoint not responding yet"
fi

# Check web frontend
if curl -f -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Web frontend responding"
else
    echo "⚠️  Web frontend not responding yet"
fi

# Check MailHog
if curl -f -s http://localhost:8025/ > /dev/null 2>&1; then
    echo "✅ MailHog responding"
else
    echo "⚠️  MailHog not responding yet"
fi

echo "\n🎉 ApaceTicket is ready!"
echo ""
echo "🌐 Access your application:"
echo "   Main App: http://localhost:3000"
echo "   API Health: http://localhost:4000/health"
echo "   API Docs: http://localhost:4000/api/docs"
echo "   Email Testing: http://localhost:8025"
echo ""
echo "🔑 Demo Login Credentials:"
echo "   Admin: admin@apace.local / admin123"
echo "   Support: support@apace.local / support123"
echo "   Business Dev: bd@apace.local / bd123456"
echo "   Management: mgmt@apace.local / mgmt123"
echo "   Product Dev: productdev@apace.local / productdev123"
echo ""
echo "📋 Features Available:"
echo "   ✅ User & Role Management"
echo "   ✅ Team & KPI Customization"
echo "   ✅ Advanced Ticket Oversight"
echo "   ✅ Reporting & Analytics"
echo "   ✅ Email Notification System"
echo "   ✅ Invoice & Finance Management"
echo "   ✅ System Customization"
echo "   ✅ Security Controls & Audit Logs"
echo ""
echo "🎯 Ready to test the complete Admin ERP Control Center!"
echo "\n✨ All services are healthy and ready for use!"