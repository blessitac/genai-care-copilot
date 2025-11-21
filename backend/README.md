# Backend - GenAI Care Copilot

This directory contains the FastAPI backend server for the GenAI Care Copilot application.

## Purpose

The backend provides a REST API that serves patient data and generates AI-powered responses for both clinicians and patients. It includes:

- Patient data management
- AI-powered clinical summaries
- Patient-friendly question answering
- Health monitoring endpoints

## Key Files

- **`main.py`** - FastAPI application with all API endpoints
- **`models.py`** - Pydantic data models for request/response validation
- **`ai.py`** - AI engine for generating intelligent responses
- **`requirements.txt`** - Python dependencies
- **`run.sh`** / **`run.ps1`** - Platform-specific run scripts
- **`Dockerfile`** - Container configuration
- **`data/`** - Mock healthcare data in JSON format

## Data Files

The `data/` directory contains mock healthcare data:

- **`patients.json`** - Patient demographics and basic information
- **`clinical_notes.json`** - Clinical notes and observations
- **`medications.json`** - Current medications and prescriptions
- **`labs_and_vitals.json`** - Laboratory results and vital signs
- **`care_plan.json`** - Treatment plans and care instructions

## Running the Backend

### Quick Start
```bash
# Make script executable and run
chmod +x run.sh
./run.sh
```

### Manual Start
```bash
# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### With Docker
```bash
# From project root
docker-compose up backend
```

## Environment Variables

- **`OPENAI_API_KEY`** - OpenAI API key for real AI responses (optional)
- **`BACKEND_PORT`** - Port to run the server on (default: 8000)
- **`CORS_ORIGINS`** - Comma-separated list of allowed origins for CORS

## API Endpoints

### Health Check
- **GET `/api/health`** - Server status check

### Patient Data
- **GET `/api/patients`** - List all patients
- **GET `/api/patients/{id}`** - Get detailed patient information

### AI Generation
- **POST `/api/generate/clinician-summary`** - Generate clinical summary
- **POST `/api/generate/patient-answer`** - Generate patient-friendly answers

## Testing

Test the API endpoints:

```bash
# Health check
curl http://localhost:8000/api/health

# Get patients
curl http://localhost:8000/api/patients

# Get specific patient
curl http://localhost:8000/api/patients/P001
```

## Available Scripts

- **`./run.sh`** - Start development server (Unix/Linux/macOS)
- **`./run.ps1`** - Start development server (Windows PowerShell)

## Dependencies

See `requirements.txt` for the complete list of Python dependencies. Key packages include:

- FastAPI - Web framework
- Uvicorn - ASGI server
- Pydantic - Data validation
- OpenAI - AI integration
- Python-dotenv - Environment variable management

## Development Notes

- The server runs with auto-reload enabled in development mode
- CORS is configured to allow requests from common development ports
- AI responses fall back to rule-based generation when OpenAI API key is not provided
- All data is currently mock data stored in JSON files