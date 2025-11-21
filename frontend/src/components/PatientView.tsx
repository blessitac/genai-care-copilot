import { useState, useEffect } from 'react'
import { fetchPatientDetails, generatePatientAnswer } from '../api'
import { PatientDetails, ChatMessage } from '../types'

interface PatientViewProps {
  patientId: string;
  onChangePatient: (patientId: string) => void;
  onBack: () => void;
}

export default function PatientView({ patientId, onBack }: PatientViewProps) {
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const quickQuestions = [
    "Explain my medications",
    "What should I do this week?",
    "Why am I taking Lisinopril?"
  ]

  useEffect(() => {
    loadPatientDetails()
  }, [patientId])

  const loadPatientDetails = async () => {
    try {
      setLoading(true)
      const data = await fetchPatientDetails(patientId)
      setPatientDetails(data)
    } catch (err) {
      setError('Failed to load patient details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async (question: string) => {
    if (!question.trim()) return

    // Add user message to chat
    const userMessage: ChatMessage = { sender: 'user', text: question }
    setChatMessages(prev => [...prev, userMessage])
    
    try {
      setLoading(true)
      const response = await generatePatientAnswer(patientId, question)
      
      // Add AI response to chat
      const aiMessage: ChatMessage = { sender: 'ai', text: response.answer }
      setChatMessages(prev => [...prev, aiMessage])
      
      setCurrentQuestion('')
    } catch (err) {
      setError('Failed to get answer from copilot')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    setCurrentQuestion(question)
    handleAskQuestion(question)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAskQuestion(currentQuestion)
  }

  if (loading && !patientDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {patientDetails && (
          <div className="space-y-6">
            {/* Patient Summary Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Hi, {patientDetails.patient.name.split(' ')[0]}!
                </h2>
                <p className="text-gray-600">Welcome to your health portal</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your Conditions</h3>
                  <div className="flex flex-wrap gap-2">
                    {patientDetails.patient.conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Note</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {patientDetails.note.substring(0, 150)}...
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Your Medications</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium text-gray-900">Name</th>
                          <th className="text-left py-2 font-medium text-gray-900">Dose</th>
                          <th className="text-left py-2 font-medium text-gray-900">Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patientDetails.medications.map((med, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 font-medium">{med.name}</td>
                            <td className="py-2 text-gray-600">{med.dose}</td>
                            <td className="py-2 text-gray-600">{med.frequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Ask Your Care Copilot</h3>
                <p className="text-gray-600 text-sm">Get personalized answers about your health</p>
              </div>

              {/* Quick Questions */}
              <div className="p-6 border-b bg-gray-50">
                <h4 className="font-medium text-gray-900 mb-3">Quick Questions</h4>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      disabled={loading}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-lg transition-colors disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Ask a question to start chatting with your care copilot
                  </p>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Input Form */}
              <div className="p-6 border-t">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Ask a question about your health..."
                    disabled={loading}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !currentQuestion.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                  >
                    Ask Copilot
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}