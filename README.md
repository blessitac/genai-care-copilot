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
- **POST /api/generate/clinician-summary** - Generate a clinician summary for a patient (currently returns stubbed response)
- **POST /api/generate/patient-answer** - Generate a patient-friendly answer to a question (currently returns stubbed response)

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
This is a placeholder edit to enable PR3 creation.
