# GenAI Care Copilot Backend Run Script (Windows PowerShell)
# This script starts the FastAPI backend server with proper configuration

Write-Host "Starting GenAI Care Copilot Backend..." -ForegroundColor Green

# Load environment variables if .env file exists
$envFile = "../.env"
if (Test-Path $envFile) {
    Write-Host "Loading environment variables from .env file..." -ForegroundColor Yellow
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Set default port if not specified
$backendPort = if ($env:BACKEND_PORT) { $env:BACKEND_PORT } else { "8000" }

Write-Host "Backend will start on port: $backendPort" -ForegroundColor Cyan

# Check if OpenAI API key is set
if (-not $env:OPENAI_API_KEY) {
    Write-Host "⚠️  Warning: OPENAI_API_KEY not set. AI responses will use fallback mode." -ForegroundColor Yellow
    Write-Host "   To enable real AI responses, set OPENAI_API_KEY in your .env file." -ForegroundColor Yellow
} else {
    Write-Host "✅ OpenAI API key detected. AI responses enabled." -ForegroundColor Green
}

# Start the server
Write-Host "Starting uvicorn server..." -ForegroundColor Green
uvicorn main:app --host 0.0.0.0 --port $backendPort --reload