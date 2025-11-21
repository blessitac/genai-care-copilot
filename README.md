# genai-care-copilot
A prototype GenAI Care Copilot that unifies patient, clinician, and health system workflows using mock healthcare data, a FastAPI backend, and a React frontend.

This is a placeholder edit to enable PR1 creation.

## Mock Data Structure

All mock data is stored in `backend/data/`

These files include: `patients.json`, `clinical_notes.json`, `medications.json`, `labs_and_vitals.json`, `care_plan.json`

They represent the seed data for the GenAI Care Copilot prototype

## Backend Setup

To run the backend:
```bash
cd backend
uvicorn main:app --reload
```

### Available Endpoints

- **GET /api/patients** - Return list of all patients
- **GET /api/patients/{id}** - Return detailed patient information including clinical notes, medications, labs/vitals, and care plan
- **POST /api/generate/clinician-summary** - Generate a clinician summary for a patient using AI engine
- **POST /api/generate/patient-answer** - Generate a patient-friendly answer to a question using AI engine

### API Examples

Get all patients:
```bash
curl http://localhost:8000/api/patients
```

Get specific patient details:
```bash
curl http://localhost:8000/api/patients/P001
```

Generate clinician summary:
```bash
curl -X POST http://localhost:8000/api/generate/clinician-summary \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "P001"}'
```

Generate patient answer:
```bash
curl -X POST http://localhost:8000/api/generate/patient-answer \
  -H "Content-Type: application/json" \
  -d '{"patient_id": "P001", "question": "Why am I on this medication?"}'
```

## AI Engine Configuration

The backend uses optional OpenAI integration for generating intelligent responses. The AI engine supports two modes of operation:

- **With OpenAI API Key**: When the `OPENAI_API_KEY` environment variable is set, the application will use a real LLM (GPT-4o-mini) to generate clinician summaries and patient answers.
- **Without OpenAI API Key**: When no API key is provided, the application will fall back to realistic, rule-based stubbed responses that analyze the patient data to provide meaningful outputs.

### Setting up OpenAI Integration

To enable AI-powered responses, set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="sk-..."
```

Restart the backend after setting the key:

```bash
cd backend
uvicorn main:app --reload
```

### Fallback Behavior

If no OpenAI API key is configured, the system will:
- Generate clinician summaries based on patient data analysis (conditions, lab values, vitals)
- Provide patient-friendly explanations using keyword matching and templated responses
- Ensure all endpoints continue to work with realistic, contextual outputs

This is a placeholder edit to enable PR3 creation.
