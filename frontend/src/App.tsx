import { useState } from 'react'
import RoleSelector from './components/RoleSelector'
import ClinicianView from './components/ClinicianView'
import PatientView from './components/PatientView'

type Role = 'clinician' | 'patient' | null

function App() {
  const [role, setRole] = useState<Role>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null)

  const handleRoleSelect = (selectedRole: 'clinician' | 'patient') => {
    setRole(selectedRole)
    if (selectedRole === 'patient') {
      // Default to patient P001 for patient view
      setSelectedPatientId('P001')
    }
  }

  const handleBackToRoleSelection = () => {
    setRole(null)
    setSelectedPatientId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {role === null && (
        <RoleSelector onSelectRole={handleRoleSelect} />
      )}
      
      {role === 'clinician' && (
        <ClinicianView 
          selectedPatientId={selectedPatientId}
          onSelectPatientId={setSelectedPatientId}
          onBack={handleBackToRoleSelection}
        />
      )}
      
      {role === 'patient' && selectedPatientId && (
        <PatientView 
          patientId={selectedPatientId}
          onChangePatient={setSelectedPatientId}
          onBack={handleBackToRoleSelection}
        />
      )}
    </div>
  )
}

export default App