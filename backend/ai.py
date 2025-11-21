import os
import json
from typing import Dict, Any, List
from openai import OpenAI

# Read environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")  # optional

client = None
if OPENAI_API_KEY:
    if OPENAI_BASE_URL:
        client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
    else:
        client = OpenAI(api_key=OPENAI_API_KEY)


def _call_llm(system_prompt: str, user_prompt: str, model: str) -> str:
    """
    Call an OpenAI-compatible chat completion endpoint.
    Raises on error so caller can fall back to stub.
    """
    if client is None:
        raise RuntimeError("No OpenAI-compatible client available")
    
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content


def _clinician_stub(patient_bundle: Dict[str, Any]) -> Dict[str, Any]:
    """
    Stub implementation for clinician summary when OpenAI is not available.
    """
    patient = patient_bundle.get("patient", {})
    note = patient_bundle.get("note", "")
    labs_and_vitals = patient_bundle.get("labs_and_vitals", {})
    
    # Build visit summary from key fields
    name = patient.get("name", "Patient")
    age = patient.get("age", "unknown age")
    conditions = patient.get("conditions", [])
    conditions_str = ", ".join(conditions) if conditions else "no documented conditions"
    
    # Take first ~200 chars of note for summary
    note_snippet = note[:200] + "..." if len(note) > 200 else note
    
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
        risk_flags.append("Poor glycemic control (elevated HbA1c).")
    
    # Check blood pressure from latest vitals
    if vitals:
        latest_vitals = vitals[0]  # Assuming first is most recent
        bp = latest_vitals.get("bp", "")
        if bp:
            try:
                systolic = int(bp.split("/")[0])
                if systolic >= 140:
                    risk_flags.append("Uncontrolled hypertension.")
            except (ValueError, IndexError):
                pass
    
    # Add default risk flag if none found
    if not risk_flags:
        risk_flags.append("Chronic disease requiring close follow-up.")
    
    # Default follow-up recommendations
    follow_up_recommendations = [
        "Schedule follow-up visit within 1-2 weeks",
        "Reinforce medication adherence counseling",
        "Order follow-up laboratory studies as indicated",
        "Monitor for disease progression and complications"
    ]
    
    return {
        "visit_summary": visit_summary,
        "risk_flags": risk_flags,
        "follow_up_recommendations": follow_up_recommendations
    }


def _patient_stub(patient_bundle: Dict[str, Any], question: str) -> str:
    """
    Stub implementation for patient answers when OpenAI is not available.
    """
    medications = patient_bundle.get("medications", [])
    patient = patient_bundle.get("patient", {})
    
    # Build a friendly response mentioning medications if available
    med_names = []
    for med in medications:
        name = med.get("name", med.get("medication", ""))
        if name:
            med_names.append(name)
    
    name = patient.get("name", "").split()[0] if patient.get("name") else "there"
    
    if med_names:
        med_list = ", ".join(med_names[:3])  # Limit to first 3 medications
        return (
            f"I am using your existing health information. Some of your medicines include {med_list}. "
            f"They help control your condition and protect your organs. "
            f"For changes to treatment, talk to your doctor."
        )
    else:
        return (
            f"Hi {name}! I can help explain your health information using what your doctor has already recorded. "
            f"This information helps your care team understand your health better and make sure you get the best care. "
            f"For changes to treatment, talk to your doctor."
        )


def generate_clinician_summary(patient_bundle: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate a clinician summary using OpenAI or fallback to stub behavior.
    """
    try:
        # Choose model based on base URL
        if OPENAI_BASE_URL:
            model_name = "llama-3.1-8b-instant"   # or another Llama model exposed by the provider
        else:
            model_name = "gpt-4o-mini"
        
        # Build system prompt
        system_prompt = (
            "You are an AI clinical assistant helping a primary care doctor prepare for a visit. "
            "You receive JSON with patient demographics, chronic conditions, a recent clinical note, "
            "labs, vitals, and care plan tasks. Respond in concise, clinical language."
        )
        
        # Build user prompt
        user_prompt = (
            "Here is the JSON data about the patient:\n\n"
            + json.dumps(patient_bundle, indent=2)
            + "\n\nSummarize this into three parts:\n"
            "1) A brief visit summary (3–5 sentences).\n"
            "2) A list of 2–4 risk flags.\n"
            "3) A list of 3–5 follow-up recommendations.\n\n"
            "Respond ONLY in JSON with the keys: "
            "visit_summary (string), risk_flags (list of strings), "
            "follow_up_recommendations (list of strings)."
        )
        
        # Call LLM
        raw = _call_llm(system_prompt, user_prompt, model_name)
        
        # Parse response
        parsed = json.loads(raw)
        
        # Return structured response
        return {
            "visit_summary": parsed.get("visit_summary", ""),
            "risk_flags": parsed.get("risk_flags", []),
            "follow_up_recommendations": parsed.get("follow_up_recommendations", [])
        }
        
    except Exception as e:
        print(f"[AI] Falling back to clinician stub due to error: {e}")
        return _clinician_stub(patient_bundle)


def generate_patient_answer(patient_bundle: Dict[str, Any], question: str) -> str:
    """
    Generate a patient-friendly answer using OpenAI or fallback to stub behavior.
    """
    try:
        # Choose model based on base URL
        if OPENAI_BASE_URL:
            model_name = "llama-3.1-8b-instant"
        else:
            model_name = "gpt-4o-mini"
        
        # Build system prompt
        system_prompt = (
            "You are a warm, empathetic AI health assistant speaking directly to a patient. "
            "Explain their health information in simple terms at a 6th grade reading level. "
            "Do NOT invent new diagnoses or change medications; only explain what is already in the data."
        )
        
        # Build user prompt
        user_prompt = (
            f'The patient asked the following question:\n"{question}"\n\n'
            "Here is the JSON data about the patient:\n\n"
            + json.dumps(patient_bundle, indent=2)
            + "\n\nAnswer the patient in 1–3 short paragraphs, using simple language. "
            "If you mention medicines or tasks, use their names from the JSON."
        )
        
        # Call LLM and return answer
        answer = _call_llm(system_prompt, user_prompt, model_name)
        return answer
        
    except Exception as e:
        print(f"[AI] Falling back to patient stub due to error: {e}")
        return _patient_stub(patient_bundle, question)