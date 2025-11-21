# GenAI Care Copilot

A prototype GenAI Care Copilot that unifies patient, clinician, and health system workflows using mock healthcare data, a FastAPI backend, and a React frontend. This application demonstrates how AI can enhance healthcare delivery by providing intelligent summaries for clinicians and patient-friendly explanations for patients.

## Architecture Overview

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   React Frontend │ ◄─────────────────► │  FastAPI Backend │
│   (TypeScript)   │                     │    (Python)      │
│                  │                     │                  │
│ • Clinician View │                     │ • Patient Data   │
│ • Patient Portal │                     │ • AI Engine      │
│ • Role Selector  │                     │ • OpenAI API     │
└─────────────────┘                     └──────────────────┘
                                                   │
                                                   ▼
                                         ┌──────────────────┐
                                         │   Mock Data      │
                                         │   (JSON Files)   │
                                         │                  │
                                         │ • patients.json  │
                                         │ • clinical_notes │
                                         │ • medications    │
                                         │ • labs_vitals    │
                                         │ • care_plans     │
                                         └──────────────────┘
```

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Clone and Setup Environment

```bash
git clone <repository-url>
cd genai-care-copilot
cp .env.example .env
```

Edit `.env` file and add your OpenAI API key (optional):
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
chmod +x run.sh
./run.sh
```

Or manually:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
chmod +x run.sh
./run.sh
```

Or manually:
```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Docker Setup (Alternative)

For a containerized setup:

```bash
docker-compose up --build
```

This will start both frontend and backend services with proper networking.

## Backend Configuration

### Python Version
- **Required**: Python 3.11 or higher
- **Recommended**: Python 3.11

### Dependencies Installation
```bash
cd backend
pip install -r requirements.txt
```

### Running Backend
```bash
# Using the run script (recommended)
chmod +x run.sh
./run.sh

# Or manually with uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Environment Variables
Set `OPENAI_API_KEY` for real AI responses:
```bash
export OPENAI_API_KEY="sk-..."
```

Without an API key, the system uses intelligent fallback responses based on patient data analysis.

## Frontend Configuration

### Running Development Server
```bash
cd frontend
npm install
npm run dev -- --port=5173
```

The frontend automatically proxies API requests to the backend at `http://localhost:8000`.

### Expected CORS Behavior
The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative React dev server)
- Production domains (configurable)

## API Endpoints

### Patient Data
- **GET /api/patients**
  - Returns list of all patients
  - Response: Array of patient objects with basic info

- **GET /api/patients/{id}**
  - Returns detailed patient information
  - Response: Complete patient data including clinical notes, medications, labs, vitals, and care plans

### AI Generation
- **POST /api/generate/clinician-summary**
  - Generates AI-powered clinical summary
  - Request: `{"patient_id": "P001"}`
  - Response: Structured summary with visit notes, risk flags, and recommendations

- **POST /api/generate/patient-answer**
  - Generates patient-friendly answers to questions
  - Request: `{"patient_id": "P001", "question": "Why am I on this medication?"}`
  - Response: Plain text answer tailored for patient understanding

### Health Check
- **GET /api/health**
  - Returns backend status
  - Response: `{"status": "ok", "message": "Backend is running"}`

### Example API Calls

```bash
# Get all patients
curl http://localhost:8000/api/patients

# Get specific patient
curl http://localhost:8000/api/patients/P001

# Generate clinician summary
curl -X POST http://localhost:8000/api/generate/clinician-summary \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "P001"}'

# Ask patient question
curl -X POST http://localhost:8000/api/generate/patient-answer \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "P001", "question": "What are my current medications?"}'

# Health check
curl http://localhost:8000/api/health
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation and serialization
- **OpenAI API** - AI-powered text generation
- **Uvicorn** - ASGI server for production

### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Development Tools
- **Docker** - Containerization
- **ESLint** - JavaScript/TypeScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Deployment Instructions

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set environment variables:
   - `OPENAI_API_KEY` (optional)
   - `PYTHON_VERSION=3.11`
5. Deploy

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. From the frontend directory: `vercel`
3. Configure build settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.onrender.com`
5. Deploy

### Environment Variables for Production

Backend (.env):
```bash
OPENAI_API_KEY=sk-your-production-key
BACKEND_PORT=8000
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

Frontend (.env):
```bash
VITE_API_URL=https://your-backend-domain.onrender.com
```

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version: `python --version` (should be 3.11+)
- Install dependencies: `pip install -r requirements.txt`
- Check port availability: `lsof -i :8000`

**Frontend can't connect to backend:**
- Verify backend is running on port 8000
- Check CORS configuration in `backend/main.py`
- Ensure API URL is correct in frontend configuration

**AI responses not working:**
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI API quota and billing
- System will fall back to rule-based responses without API key

**Docker issues:**
- Ensure Docker and Docker Compose are installed
- Check port conflicts: `docker ps`
- Rebuild containers: `docker-compose up --build --force-recreate`

**Permission errors on scripts:**
- Make scripts executable: `chmod +x backend/run.sh frontend/run.sh`
- On Windows, use PowerShell scripts: `backend/run.ps1`

### Development Tips

- Use `npm run dev` for frontend hot reloading
- Use `uvicorn main:app --reload` for backend auto-restart
- Check browser console for frontend errors
- Check terminal output for backend errors
- Use `/api/health` endpoint to verify backend connectivity

### Performance Optimization

- Frontend builds are optimized for production with Vite
- Backend uses async/await for non-blocking operations
- Static assets are served efficiently
- API responses are structured for minimal data transfer

## Project Structure

```
genai-care-copilot/
├── README.md                 # This file
├── .env.example             # Environment template
├── docker-compose.yml       # Docker orchestration
├── .gitignore              # Git ignore rules
│
├── backend/                 # FastAPI backend
│   ├── README.md           # Backend-specific docs
│   ├── requirements.txt    # Python dependencies
│   ├── run.sh             # Unix run script
│   ├── run.ps1            # Windows run script
│   ├── Dockerfile         # Backend container
│   ├── main.py            # FastAPI application
│   ├── models.py          # Pydantic models
│   ├── ai.py              # AI engine logic
│   └── data/              # Mock healthcare data
│       ├── patients.json
│       ├── clinical_notes.json
│       ├── medications.json
│       ├── labs_and_vitals.json
│       └── care_plan.json
│
└── frontend/               # React frontend
    ├── README.md          # Frontend-specific docs
    ├── package.json       # Node dependencies
    ├── run.sh            # Unix run script
    ├── Dockerfile        # Frontend container
    ├── vite.config.ts    # Vite configuration
    ├── tailwind.config.js # Tailwind CSS config
    ├── src/              # Source code
    │   ├── App.tsx       # Main application
    │   ├── main.tsx      # Entry point
    │   ├── api.ts        # API client
    │   ├── types.ts      # TypeScript types
    │   └── components/   # React components
    └── dist/             # Built assets (generated)
```

This project is designed to be interview-ready and demonstrates modern full-stack development practices with AI integration.
Placeholder for PR #6
