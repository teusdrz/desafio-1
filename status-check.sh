#!/bin/bash

echo "🔍 Checking Hypesoft System Status..."
echo "======================================"

# Check Backend API
echo -n "Backend API (http://localhost:5000): "
if curl -s --max-time 5 http://localhost:5000/api/status > /dev/null 2>&1; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RESPONDING"
fi

# Check Frontend using netcat
echo -n "Frontend (http://localhost:4000): "
if nc -z localhost 4000 2>/dev/null; then
    echo "✅ RUNNING"
else
    echo "❌ NOT RESPONDING"
fi

# Check Authentication
echo -n "Authentication: "
if curl -s --max-time 5 -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@hypesoft.com","password":"admin123"}' \
    2>/dev/null | grep -q "token"; then
    echo "✅ WORKING"
else
    echo "❌ FAILED"
fi

echo ""
echo "🚀 System Status Summary:"
echo "   Backend API: http://localhost:5000"
echo "   Frontend UI: http://localhost:4000"
echo "   Login Page:  http://localhost:4000/login"
echo ""
echo "📖 Check TESTING_GUIDE.md for demo users"
