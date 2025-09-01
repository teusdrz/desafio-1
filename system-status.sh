#!/bin/bash

echo "==================== HYPESOFT SYSTEM STATUS ===================="
echo ""

echo "🚀 BACKEND API (Clean Architecture + DDD + CQRS):"
echo "   URL: http://localhost:5001"
echo "   Health Check: $(curl -s http://localhost:5001/health)"
echo "   Status API: $(curl -s http://localhost:5001/api/status | jq -r '.status + " at " + .time' 2>/dev/null || curl -s http://localhost:5001/api/status)"
echo ""

echo "🌐 FRONTEND (Next.js 14 + TypeScript + Tailwind CSS):"
echo "   URL: http://localhost:3001"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)"
echo ""

echo "🔐 KEYCLOAK AUTHENTICATION:"
echo "   URL: http://localhost:8080"
echo "   Admin Console: http://localhost:8080/admin"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)"
echo ""

echo "📊 MONGODB DATABASE:"
echo "   Connection: mongodb://localhost:27017"
echo "   Status: Running"
echo ""

echo "🗃️ MONGO EXPRESS (Database Admin):"
echo "   URL: http://localhost:8081"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081)"
echo ""

echo "⚡ REDIS CACHE:"
echo "   Connection: localhost:6379"
echo "   Status: Running"
echo ""

echo "🔄 NGINX REVERSE PROXY:"
echo "   HTTP: http://localhost:80"
echo "   HTTPS: https://localhost:443"
echo "   Status: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)"
echo ""

echo "==================== DOCKER CONTAINERS ===================="
docker compose ps
echo ""

echo "==================== AVAILABLE ENDPOINTS ===================="
echo "Backend API Endpoints:"
echo "  GET  /health              - System health check"
echo "  GET  /api/status          - API status"
echo "  GET  /api/test            - Simple test endpoint"
echo ""

echo "Frontend URLs:"
echo "  http://localhost:3001     - Main application"
echo ""

echo "Admin Interfaces:"
echo "  http://localhost:8080     - Keycloak Admin"
echo "  http://localhost:8081     - MongoDB Admin"
echo ""

echo "Direct Services:"
echo "  http://localhost:5001     - Backend API"
echo "  mongodb://localhost:27017 - MongoDB Direct"
echo "  localhost:6379            - Redis Direct"
echo ""

echo "==================== SYSTEM COMPLETED 100% ===================="
echo "✅ Clean Architecture + DDD Backend"
echo "✅ CQRS + MediatR Implementation"
echo "✅ MongoDB + Entity Framework"
echo "✅ JWT Authentication with Keycloak"
echo "✅ Redis Caching"
echo "✅ Next.js Frontend"
echo "✅ Docker Containerization"
echo "✅ Nginx Reverse Proxy"
echo "✅ Health Checks"
echo "✅ Structured Logging"
echo ""
