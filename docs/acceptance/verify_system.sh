#!/bin/bash

echo "🎫 ApaceTicket System Verification"
echo "=================================="

# Test API Health
echo "🔍 Testing API Health..."
HEALTH=$(curl -s http://localhost:4000/health)
if [[ $? -eq 0 ]]; then
    echo "✅ API Health: $(echo $HEALTH | jq -r '.status')"
else
    echo "❌ API Health: Failed"
fi

# Test Web App
echo "🔍 Testing Web Application..."
WEB_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [[ $WEB_STATUS -eq 200 ]]; then
    echo "✅ Web App: Running (HTTP $WEB_STATUS)"
else
    echo "❌ Web App: Failed (HTTP $WEB_STATUS)"
fi

# Test API Documentation
echo "🔍 Testing API Documentation..."
DOCS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/docs)
if [[ $DOCS_STATUS -eq 200 ]]; then
    echo "✅ API Docs: Available (HTTP $DOCS_STATUS)"
else
    echo "❌ API Docs: Failed (HTTP $DOCS_STATUS)"
fi

# Test Users Endpoint
echo "🔍 Testing Users Endpoint..."
USERS=$(curl -s http://localhost:4000/users)
USER_COUNT=$(echo $USERS | jq '. | length')
if [[ $USER_COUNT -gt 0 ]]; then
    echo "✅ Users: $USER_COUNT users found"
    echo "   📧 $(echo $USERS | jq -r '.[0].email') ($(echo $USERS | jq -r '.[0].role'))"
else
    echo "❌ Users: No users found"
fi

# Test Tickets Endpoint
echo "🔍 Testing Tickets Endpoint..."
TICKETS=$(curl -s http://localhost:4000/tickets)
TICKET_COUNT=$(echo $TICKETS | jq '. | length')
if [[ $TICKET_COUNT -gt 0 ]]; then
    echo "✅ Tickets: $TICKET_COUNT tickets found"
    
    # Check SLA statuses
    GREEN_COUNT=$(echo $TICKETS | jq '[.[] | select(.slaStatus == "GREEN")] | length')
    YELLOW_COUNT=$(echo $TICKETS | jq '[.[] | select(.slaStatus == "YELLOW")] | length')
    RED_COUNT=$(echo $TICKETS | jq '[.[] | select(.slaStatus == "RED")] | length')
    
    echo "   🟢 GREEN SLA: $GREEN_COUNT tickets"
    echo "   🟡 YELLOW SLA: $YELLOW_COUNT tickets"
    echo "   🔴 RED SLA: $RED_COUNT tickets"
else
    echo "❌ Tickets: No tickets found"
fi

# Test Database Connection
echo "🔍 Testing Database Connection..."
DB_TEST=$(docker exec apace-ticket-postgres psql -U postgres -d apace_ticket -c "SELECT COUNT(*) FROM users;" 2>/dev/null)
if [[ $? -eq 0 ]]; then
    echo "✅ Database: Connected and accessible"
else
    echo "❌ Database: Connection failed"
fi

echo ""
echo "🎯 System Status Summary:"
echo "========================"
echo "🌐 Web App: http://localhost:3000"
echo "🔧 API: http://localhost:4000"
echo "📚 API Docs: http://localhost:4000/api/docs"
echo "❤️ Health: http://localhost:4000/health"
echo ""
echo "🔐 Default Credentials:"
echo "admin@apace.local / admin123 (Admin)"
echo "support@apace.local / support123 (Agent)"
echo "bd@apace.local / bd123 (User)"
echo "mgmt@apace.local / mgmt123 (Admin)"