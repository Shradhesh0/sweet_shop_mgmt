#!/bin/bash

# Docker startup script for Sweet Shop Management System

echo "🍬 Starting Sweet Shop Management System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building and starting services..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Services started!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:3000/api"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"

