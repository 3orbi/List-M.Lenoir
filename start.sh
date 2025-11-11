#!/bin/bash

# TodoList Docker Startup Script

set -e

echo "================================================"
echo "  TodoList Application - Docker Setup"
echo "================================================"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created. Please review and update if needed."
fi

echo ""
echo "🔨 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "================================================"
echo "  ✅ TodoList Application is Running!"
echo "================================================"
echo ""
echo "📍 Frontend:  http://localhost:5173"
echo "📍 Backend:   http://localhost:3001"
echo "📍 Database:  localhost:5432"
echo ""
echo "📝 Commands:"
echo "   docker-compose logs -f          # View logs"
echo "   docker-compose down             # Stop all services"
echo "   docker-compose down -v          # Stop and remove volumes"
echo ""
echo "📚 Documentation: See DOCKER_SETUP.md"
echo ""
