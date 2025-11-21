import os
import json
from typing import Dict, List

# Read the API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def call_llm(system_prompt: str, user_prompt: str) -> str:
    """
    Call the LLM with system and user prompts.
    Falls back to stubbed behavior if OpenAI is not available.
    """
    if not OPENAI_API_KEY:
        raise ValueError("No OpenAI API key available")
    
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content
    except Exception:
        # Fall back to stubbed behavior if any error occurs
        raise ValueError("OpenAI call failed")

def generate_clinician_summary(patient_bundle: dict) -> dict:
    """
    Generate a clinician summary using LLM or fallback to stubbed behavior.
    """
    if OPENAI_API_KEY:
        try:
            # Build prompts for LLM
            system_prompt = (
                "You are an AI clinical assistant helping a primary care doctor prepare for a patient visit. "
                "You will receive structured JSON with patient demographics, conditions, a recent clinical note, "
                "labs and vitals, and care plan tasks. You must respond in concise, clinical language."
            )
            
            patient_json = json.dumps(patient_bundle, indent=2)
            user_prompt = (
                f"You are given the following JSON data about a patient:\n\n{patient_json}\n\n"
                "Summarize this into three parts:\n"
                "1) A brief visit summary (3–5 sentences).\n"
                "2) A list of 2–4 risk flags (short bullet items).\n"
                "3) A list of 3–5 follow-up recommendations (short bullet items).\n\n"
                "Respond in the following strict JSON format with keys: visit_summary, risk_flags, follow_up_recommendations.\n"
                "Do not include any other keys. Do not include explanations."
            )
            
            llm_response = call_llm(system_prompt, user_prompt)
            
            # Try to parse the LLM response as JSON
            try:
                result = json.loads(llm_response)
                # Validate the expected keys exist
                if all(key in result for key in ["visit_summary", "risk_flags", "follow_up_recommendations"]):
                    return result
            except json.JSONDecodeError:
                pass
            
            # If parsing fails, fall through to stubbed behavior
        except ValueError:
            # OpenAI call failed, fall through to stubbed behavior
            pass
    
    # Stubbed behavior when OpenAI is not available or fails
    patient = patient_bundle.get("patient", {})
    note = patient_bundle.get("note", "")
    labs_and_vitals = patient_bundle.get("labs_and_vitals", {})
    
    # Build visit summary from key fields
    name = patient.get("name", "Patient")
    age = patient.get("age", "unknown age")
    conditions = patient.get("conditions", [])
    conditions_str = ", ".join(conditions) if conditions else "no documented conditions"
    
    # Take first part of note for summary
    note_snippet = note[:100] + "..." if len(note) > 100 else note
    
    visit_summary = (
        f"{name}, {age} years old, with {conditions_str}. "
        f"Recent clinical note indicates: {note_snippet if note_snippet.strip() else 'routine visit'}. "
        "Patient requires ongoing monitoring and care coordination."
    )
    
    # Determine risk flags based on data
    risk_flags = []
    labs = labs_and_vitals.get("labs", {})
    vitals = labs_and_vitals.get("vitals", [])
    
    # Check HbA1c
    if "hba1c" in labs and labs["hba1c"].get("value", 0) > 8.0:
        risk_flags.append("Poor glycemic control")
    
    # Check blood pressure from latest vitals
    if vitals:
        latest_vitals = vitals[0]  # Assuming first is most recent
        bp = latest_vitals.get("bp", "")
        if bp:
            try:
                systolic = int(bp.split("/")[0])
                if systolic >= 140:
                    risk_flags.append("Uncontrolled hypertension")
            except (ValueError, IndexError):
                pass
    
    # Add default risk flags if none found
    if not risk_flags:
        if "Diabetes" in conditions_str:
            risk_flags.append("Diabetes management needed")
        if "Hypertension" in conditions_str:
            risk_flags.append("Blood pressure monitoring required")
    
    # Default follow-up recommendations
    follow_up_recommendations = [
        "Schedule follow-up visit within 1–2 weeks",
        "Reinforce medication adherence",
        "Order follow-up labs as needed"
    ]
    
    # Add condition-specific recommendations
    if "Diabetes" in conditions_str:
        follow_up_recommendations.append("Review diabetes self-management")
    if "Heart" in conditions_str or "Hypertension" in conditions_str:
        follow_up_recommendations.append("Monitor cardiovascular status")
    
    return {
        "visit_summary": visit_summary,
        "risk_flags": risk_flags[:4],  # Limit to 4 as specified
        "follow_up_recommendations": follow_up_recommendations[:5]  # Limit to 5 as specified
    }

def generate_patient_answer(patient_bundle: dict, question: str) -> str:
    """
    Generate a patient-friendly answer using LLM or fallback to stubbed behavior.
    """
    if OPENAI_API_KEY:
        try:
            # Build prompts for LLM
            system_prompt = (
                "You are a kind, empathetic AI health assistant speaking to a patient. "
                "You must explain their health information in very simple terms at a 6th grade reading level. "
                "You should not give new diagnoses or change medications; only explain what is already in the data."
            )
            
            patient_json = json.dumps(patient_bundle, indent=2)
            user_prompt = (
                f'The patient has asked the following question:\n'
                f'"{question}"\n\n'
                f'Here is the JSON data about the patient:\n\n{patient_json}\n\n'
                f'Answer the patient in 1–3 short paragraphs, using simple language. Avoid medical jargon. '
                f'If you refer to medications or tasks, use their names from the JSON.'
            )
            
            llm_response = call_llm(system_prompt, user_prompt)
            return llm_response
            
        except ValueError:
            # OpenAI call failed, fall through to stubbed behavior
            pass
    
    # Stubbed behavior when OpenAI is not available or fails
    medications = patient_bundle.get("medications", [])
    patient = patient_bundle.get("patient", {})
    
    # Simple keyword-based responses
    question_lower = question.lower()
    
    # Check for specific medication mentions
    for med in medications:
        med_name = med.get("name", med.get("medication", "")).lower()
        if med_name in question_lower:
            indication = med.get("indication", "your condition")
            return (
                f"Your medication {med.get('name', med.get('medication', 'this medicine'))} helps with {indication}. "
                f"It's important to take it as your doctor prescribed to help keep you healthy and safe. "
                f"If you have concerns about this medication, please talk to your doctor or pharmacist."
            )
    
    # Generic patient-friendly response
    name = patient.get("name", "").split()[0] if patient.get("name") else "there"
    return (
        f"Hi {name}! I can help explain your health information using what your doctor has already recorded. "
        f"This information helps your care team understand your health better and make sure you get the best care. "
        f"If you have specific questions about your treatment, it's always best to talk directly with your doctor."
    )