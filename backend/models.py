from pydantic import BaseModel
from typing import List, Dict, Any

class Patient(BaseModel):
    patient_id: str
    name: str
    age: int
    sex: str
    conditions: List[str]
    risk_score: str
    primary_provider: str

class ClinicianSummaryRequest(BaseModel):
    patient_id: str

class ClinicianSummaryResponse(BaseModel):
    visit_summary: str
    risk_flags: List[str]
    follow_up_recommendations: List[str]

class PatientQuestionRequest(BaseModel):
    patient_id: str
    question: str

class PatientAnswerResponse(BaseModel):
    answer: str

class PatientDetailResponse(BaseModel):
    patient: Patient
    note: str
    medications: List[Dict[str, Any]]
    labs_and_vitals: Dict[str, Any]
    care_plan: List[Dict[str, Any]]