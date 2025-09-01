#!/bin/bash

# System Health Check Script
echo "🔍 Checking Hypesoft System Status..."
echo "======================================"

# Check Backend
if curl -s http://localhost:5000/api/status > /dev/null; then
    echo "✅ Backend API: RUNNING (http://localhost:5000)"
else
    echo "❌ Backend API: NOT RESPONDING"
fi

# Check Frontend  
if curl -s http://localhost:3002 > /dev/null; then
    echo "✅ Frontend: RUNNING (http://localhost:3002)"
else
    echo "❌ Frontend: NOT RESPONDING"
fi

# Check Authentication
if curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@hypesoft.com","password":"admin123"}' \
    | grep -q "token"; then
    echo "✅ Authentication: WORKING"
else
    echo "❌ Authentication: FAILED"
fi

echo ""
echo "🚀 System ready for testing!"
echo "📖 Check TESTING_GUIDE.md for demo users"
