import { useState, useEffect } from 'react'
import { fetchPatients, fetchPatientDetails, generateClinicianSummary } from '../api'
import { Patient, PatientDetails, ClinicianSummary } from '../types'

interface ClinicianViewProps {
  selectedPatientId: string | null;
  onSelectPatientId: (patientId: string) => void;
  onBack: () => void;
}

export default function ClinicianView({ selectedPatientId, onSelectPatientId, onBack }: ClinicianViewProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null)
  const [summary, setSummary] = useState<ClinicianSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    if (selectedPatientId) {
      loadPatientDetails(selectedPatientId)
    }
  }, [selectedPatientId])

  const loadPatients = async () => {
    try {
      const data = await fetchPatients()
      setPatients(data)
    } catch (err) {
      setError('Failed to load patients')
      console.error(err)
    }
  }

  const loadPatientDetails = async (patientId: string) => {
    try {
      setLoading(true)
      const data = await fetchPatientDetails(patientId)
      setPatientDetails(data)
      setSummary(null) // Clear previous summary
    } catch (err) {
      setError('Failed to load patient details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateSummary = async () => {
    if (!selectedPatientId) return

    try {
      setLoading(true)
      const data = await generateClinicianSummary(selectedPatientId)
      setSummary(data)
    } catch (err) {
      setError('Failed to generate summary')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Clinician Dashboard</h1>
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Role Selection
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Patient Selector */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h2>
            <div className="space-y-2">
              {patients.map((patient) => (
                <button
                  key={patient.patient_id}
                  onClick={() => onSelectPatientId(patient.patient_id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedPatientId === patient.patient_id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-600">
                    {patient.age}y, {patient.sex} • Risk: {patient.risk_score}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Panel - Patient Snapshot */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Snapshot</h2>
            {loading && selectedPatientId && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading patient details...</p>
              </div>
            )}

            {patientDetails && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{patientDetails.patient.name}</h3>
                  <p className="text-gray-600">
                    {patientDetails.patient.age} years old, {patientDetails.patient.sex}
                  </p>
                  <p className="text-sm text-gray-500">
                    Provider: {patientDetails.patient.primary_provider}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {patientDetails.patient.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recent Labs</h4>
                  <div className="space-y-2 text-sm">
                    {/* Labs */}
                    <div>
                      <p className="text-gray-700 font-medium mb-1">Labs</p>
                      {patientDetails.labs_and_vitals.labs &&
                        Object.entries(patientDetails.labs_and_vitals.labs).map(
                          ([labName, lab]: [string, any]) => (
                            <div key={labName} className="flex justify-between">
                              <span className="text-gray-600">{labName}:</span>
                              <span className="font-medium">
                                {lab.value} {lab.unit} {lab.date && `(${lab.date})`}
                              </span>
                            </div>
                          )
                        )}
                    </div>

                    {/* Vitals */}
                    <div>
                      <p className="text-gray-700 font-medium mb-1">Vitals</p>
                      {patientDetails.labs_and_vitals.vitals &&
                        patientDetails.labs_and_vitals.vitals.map((vital: any, idx: number) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-gray-600">
                              {vital.date ? vital.date : `Measurement ${idx + 1}`}:
                            </span>
                            <span className="font-medium">
                              {vital.bp && `BP ${vital.bp}`}
                              {vital.hr && ` • HR ${vital.hr}`}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>


                <button
                  onClick={handleGenerateSummary}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate Visit Summary'}
                </button>
              </div>
            )}

            {!selectedPatientId && (
              <p className="text-gray-500 text-center py-8">
                Select a patient to view details
              </p>
            )}
          </div>

          {/* Right Panel - AI Output */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Summary</h2>

            {summary && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Visit Summary</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {summary.visit_summary}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Risk Flags</h3>
                  <ul className="space-y-1">
                    {summary.risk_flags.map((flag, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Follow-up Recommendations</h3>
                  <ul className="space-y-1">
                    {summary.follow_up_recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!summary && (
              <p className="text-gray-500 text-center py-8">
                Generate a summary to see AI insights
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
