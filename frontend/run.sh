#!/bin/bash

# GenAI Care Copilot Frontend Run Script
# This script starts the React frontend development server

echo "Starting GenAI Care Copilot Frontend..."

# Load environment variables if .env file exists
if [ -f "../.env" ]; then
    echo "Loading environment variables from .env file..."
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Set default port if not specified
FRONTEND_PORT=${FRONTEND_PORT:-5173}

echo "Frontend will start on port: $FRONTEND_PORT"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if backend is running
echo "Checking if backend is available..."
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running and accessible"
else
    echo "⚠️  Warning: Backend not detected at http://localhost:8000"
    echo "   Make sure to start the backend first with: cd ../backend && ./run.sh"
fi

# Start the development server
echo "Starting Vite development server..."
npm run dev -- --port=${FRONTEND_PORT}