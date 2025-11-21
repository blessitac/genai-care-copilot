#!/bin/bash

# GenAI Care Copilot Backend Run Script
# This script starts the FastAPI backend server with proper configuration

echo "Starting GenAI Care Copilot Backend..."

# Load environment variables if .env file exists
if [ -f "../.env" ]; then
    echo "Loading environment variables from .env file..."
    export $(cat ../.env | grep -v '^#' | xargs)
fi

# Set default port if not specified
BACKEND_PORT=${BACKEND_PORT:-8000}

echo "Backend will start on port: $BACKEND_PORT"

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Warning: OPENAI_API_KEY not set. AI responses will use fallback mode."
    echo "   To enable real AI responses, set OPENAI_API_KEY in your .env file."
else
    echo "✅ OpenAI API key detected. AI responses enabled."
fi

# Start the server
echo "Starting uvicorn server..."
uvicorn main:app --host 0.0.0.0 --port ${BACKEND_PORT} --reload