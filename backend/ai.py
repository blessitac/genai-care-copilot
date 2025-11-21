def generate_clinician_summary(patient_bundle: dict):
    return {
        "visit_summary": "This is a stubbed clinician summary.",
        "risk_flags": ["High HbA1c", "Elevated blood pressure"],
        "follow_up_recommendations": ["Schedule follow-up", "Review medications"]
    }

def generate_patient_answer(patient_bundle: dict, question: str):
    return "This is a stubbed, patient-friendly answer."