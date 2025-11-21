import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from models import (
    Patient, 
    ClinicianSummaryRequest, 
    ClinicianSummaryResponse,
    PatientQuestionRequest, 
    PatientAnswerResponse,
    PatientDetailResponse
)
from ai import generate_clinician_summary, generate_patient_answer

app = FastAPI()

# Configure CORS origins
cors_origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative React dev server
    "http://localhost:12000", # Custom port
    "http://localhost:12001", # Custom port
]

# Add production origins from environment variable
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    cors_origins.extend([origin.strip() for origin in cors_origins_env.split(",")])

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Load data from JSON files
def load_json_data(filename: str):
    file_path = os.path.join(os.path.dirname(__file__), "data", filename)
    with open(file_path, "r") as f:
        return json.load(f)

# Load all data at startup
patients_data = load_json_data("patients.json")
clinical_notes_data = load_json_data("clinical_notes.json")
medications_data = load_json_data("medications.json")
labs_and_vitals_data = load_json_data("labs_and_vitals.json")
care_plan_data = load_json_data("care_plan.json")

@app.get("/api/health")
def health_check():
    """Health check endpoint for deployment verification."""
    return {"status": "ok", "message": "Backend is running"}

@app.get("/api/patients", response_model=List[Patient])
async def get_patients():
    """Return list of all patients."""
    return patients_data

@app.get("/api/patients/{patient_id}", response_model=PatientDetailResponse)
async def get_patient_detail(patient_id: str):
    """Return a combined object with patient details."""
    # Find the patient
    patient = None
    for p in patients_data:
        if p["patient_id"] == patient_id:
            patient = p
            break
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Get related data
    note = clinical_notes_data.get(patient_id, {}).get("note", "")
    medications = medications_data.get(patient_id, [])
    labs_and_vitals = labs_and_vitals_data.get(patient_id, {})
    care_plan = care_plan_data.get(patient_id, [])
    
    return PatientDetailResponse(
        patient=Patient(**patient),
        note=note,
        medications=medications,
        labs_and_vitals=labs_and_vitals,
        care_plan=care_plan
    )

@app.post("/api/generate/clinician-summary", response_model=ClinicianSummaryResponse)
async def generate_clinician_summary_endpoint(request: ClinicianSummaryRequest):
    """Generate a clinician summary for a patient."""
    patient_id = request.patient_id
    
    # Check if patient exists
    patient = None
    for p in patients_data:
        if p["patient_id"] == patient_id:
            patient = p
            break
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create patient bundle
    patient_bundle = {
        "patient": patient,
        "note": clinical_notes_data.get(patient_id, {}).get("note", ""),
        "medications": medications_data.get(patient_id, []),
        "labs_and_vitals": labs_and_vitals_data.get(patient_id, {}),
        "care_plan": care_plan_data.get(patient_id, [])
    }
    
    # Generate summary using AI engine
    summary = generate_clinician_summary(patient_bundle)
    
    return ClinicianSummaryResponse(**summary)

@app.post("/api/generate/patient-answer", response_model=PatientAnswerResponse)
async def generate_patient_answer_endpoint(request: PatientQuestionRequest):
    """Generate a patient-friendly answer to a question."""
    patient_id = request.patient_id
    question = request.question
    
    # Check if patient exists
    patient = None
    for p in patients_data:
        if p["patient_id"] == patient_id:
            patient = p
            break
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Create patient bundle
    patient_bundle = {
        "patient": patient,
        "note": clinical_notes_data.get(patient_id, {}).get("note", ""),
        "medications": medications_data.get(patient_id, []),
        "labs_and_vitals": labs_and_vitals_data.get(patient_id, {}),
        "care_plan": care_plan_data.get(patient_id, [])
    }
    
    # Generate answer using AI engine
    answer = generate_patient_answer(patient_bundle, question)
    
    return PatientAnswerResponse(answer=answer)