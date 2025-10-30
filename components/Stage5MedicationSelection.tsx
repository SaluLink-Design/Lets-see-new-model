'use client'

import { useState, useEffect } from 'react'
import { CaseData } from '@/app/page'

interface Stage5Props {
  caseData: CaseData
  updateCaseData: (updates: Partial<CaseData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Stage5MedicationSelection({ caseData, updateCaseData, onNext, onBack }: Stage5Props) {
  const [medications, setMedications] = useState<any[]>([])
  const [selectedMedications, setSelectedMedications] = useState<any[]>(caseData.selectedMedications)
  const [planType, setPlanType] = useState<string>('KeyCare')
  const [loading, setLoading] = useState(false)
  const [chronicMedNote, setChronicMedNote] = useState(caseData.chronicMedNote)
  const [medicineClassFilter, setMedicineClassFilter] = useState<string>('')

  useEffect(() => {
    if (caseData.confirmedCondition) {
      loadMedications()
    }
  }, [caseData.confirmedCondition, planType])

  const loadMedications = async () => {
    if (!caseData.confirmedCondition) return

    setLoading(true)
    try {
      const response = await fetch('/api/get-medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition: caseData.confirmedCondition,
          planType,
        }),
      })

      const data = await response.json()
      setMedications(data.medications || [])
    } catch (error) {
      console.error('Error loading medications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMedicationToggle = (medication: any) => {
    const isSelected = selectedMedications.some(
      m => m.medicineName === medication.medicineName
    )
    if (isSelected) {
      setSelectedMedications(
        selectedMedications.filter(m => m.medicineName !== medication.medicineName)
      )
    } else {
      setSelectedMedications([...selectedMedications, medication])
    }
  }

  const handleConfirm = () => {
    updateCaseData({
      selectedMedications,
      chronicMedNote,
    })
    onNext()
  }

  const groupedMedications = medications.reduce((acc, med) => {
    const key = med.medicineClass || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(med)
    return acc
  }, {} as Record<string, any[]>)

  const filteredClasses = medicineClassFilter
    ? Object.keys(groupedMedications).filter(cls =>
        cls.toLowerCase().includes(medicineClassFilter.toLowerCase())
      )
    : Object.keys(groupedMedications)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">
          Stage 5: Medication Selection
        </h2>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-black mb-2">
              Plan Type
            </label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="KeyCare">KeyCare</option>
              <option value="Core">Core</option>
              <option value="Priority">Priority</option>
              <option value="Saver">Saver</option>
              <option value="Executive">Executive</option>
              <option value="Comprehensive">Comprehensive</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-black mb-2">
              Filter by Medicine Class
            </label>
            <input
              type="text"
              value={medicineClassFilter}
              onChange={(e) => setMedicineClassFilter(e.target.value)}
              placeholder="Search medicine class..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading medications...</p>
        ) : (
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {filteredClasses.length === 0 ? (
              <p className="text-gray-500">No medications found</p>
            ) : (
              filteredClasses.map((medicineClass) => (
                <div key={medicineClass} className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-black mb-3">{medicineClass}</h3>
                  <div className="space-y-2">
                    {groupedMedications[medicineClass].map((medication, index) => {
                      const isSelected = selectedMedications.some(
                        m => m.medicineName === medication.medicineName
                      )
                      const isExcluded = medication.excluded && planType
                      
                      return (
                        <label
                          key={index}
                          className={`flex items-start p-3 border rounded-lg cursor-pointer ${
                            isExcluded
                              ? 'opacity-50 cursor-not-allowed bg-gray-100'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isExcluded}
                            onChange={() => handleMedicationToggle(medication)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-black">{medication.medicineName}</p>
                            <p className="text-sm text-gray-600">
                              Active Ingredient: {medication.activeIngredient}
                            </p>
                            <p className="text-sm text-gray-600">
                              CDA Core/Saver/Priority: {medication.cdaCore} | CDA Executive/Comprehensive: {medication.cdaExecutive}
                            </p>
                            {isExcluded && (
                              <p className="text-xs text-red-600 mt-1">
                                Not available on {planType} plans
                              </p>
                            )}
                            {medication.planEligibility.length > 0 && !isExcluded && (
                              <p className="text-xs text-green-600 mt-1">
                                Available on: {medication.planEligibility.join(', ')}
                              </p>
                            )}
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-black mb-2">
            Register Chronic Medication Note
          </label>
          <textarea
            value={chronicMedNote}
            onChange={(e) => setChronicMedNote(e.target.value)}
            placeholder="Enter registration notes for chronic medication..."
            className="w-full h-32 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl hover:bg-[#2C2C2C] transition-colors font-medium"
          >
            Confirm Medications
          </button>
        </div>
      </div>
    </div>
  )
}

