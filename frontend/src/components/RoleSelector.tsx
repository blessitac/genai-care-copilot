interface RoleSelectorProps {
  onSelectRole: (role: 'clinician' | 'patient') => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            GenAI Care Copilot
          </h1>
          <p className="text-gray-600 mb-8">
            Choose how you want to experience the copilot.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => onSelectRole('clinician')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            >
              Continue as Clinician
            </button>
            
            <button
              onClick={() => onSelectRole('patient')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
            >
              Continue as Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}