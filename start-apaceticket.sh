#!/bin/bash

# ApaceTicket GitHub Codespaces Startup Script
# This script sets up and runs the complete ApaceTicket ERP system

echo "🚀 Starting ApaceTicket ERP System Setup..."
echo "=========================================="

# Navigate to project root
cd /workspaces/ApaceTicket 2>/dev/null || cd "$(pwd)"

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

# Start all services with Docker Compose
docker compose -f infra/docker-compose.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "✅ ApaceTicket is ready!"
echo ""
echo "🌐 Access your application:"
echo "   Main App: http://localhost:3000"
echo "   API Docs: http://localhost:3001/api"
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