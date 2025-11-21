export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  sex: string;
  conditions: string[];
  risk_score: string;
  primary_provider: string;
}

export interface Medication {
  name: string;
  dose: string;
  frequency: string;
  indication: string;
}

export interface PatientDetails {
  patient: Patient;
  note: string;
  medications: Medication[];
  labs_and_vitals: Record<string, any>;
  care_plan: Record<string, any>[];
}

export interface ClinicianSummary {
  visit_summary: string;
  risk_flags: string[];
  follow_up_recommendations: string[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}