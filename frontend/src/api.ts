import axios from "axios";

const BASE_URL = "http://localhost:8000";

export async function fetchPatients() {
  const res = await axios.get(`${BASE_URL}/api/patients`);
  return res.data;
}

export async function fetchPatientDetails(patientId: string) {
  const res = await axios.get(`${BASE_URL}/api/patients/${patientId}`);
  return res.data;
}

export async function generateClinicianSummary(patientId: string) {
  const res = await axios.post(`${BASE_URL}/api/generate/clinician-summary`, {
    patient_id: patientId
  });
  return res.data;
}

export async function generatePatientAnswer(patientId: string, question: string) {
  const res = await axios.post(`${BASE_URL}/api/generate/patient-answer`, {
    patient_id: patientId,
    question
  });
  return res.data;
}