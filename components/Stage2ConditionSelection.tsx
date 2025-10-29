'use client'

import { useState, useEffect } from 'react'
import { CaseData } from '@/app/page'

interface Stage2Props {
  caseData: CaseData
  updateCaseData: (updates: Partial<CaseData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Stage2ConditionSelection({ caseData, updateCaseData, onNext, onBack }: Stage2Props) {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(caseData.confirmedCondition || null)
  const [icdCodes, setIcdCodes] = useState<Array<{ code: string; description: string }>>([])
  const [selectedICDCodes, setSelectedICDCodes] = useState<Array<{ code: string; description: string }>>(
    caseData.selectedICDCodes
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedCondition) {
      loadICDCodes(selectedCondition)
    }
  }, [selectedCondition])

  const loadICDCodes = async (condition: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-icd-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition }),
      })

      const data = await response.json()
      setIcdCodes(data.icdCodes || [])
    } catch (error) {
      console.error('Error loading ICD codes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConditionSelect = (condition: string) => {
    setSelectedCondition(condition)
    setSelectedICDCodes([])
    updateCaseData({ confirmedCondition: condition, selectedICDCodes: [] })
  }

  const handleICDCodeToggle = (icdCode: { code: string; description: string }) => {
    const isSelected = selectedICDCodes.some(c => c.code === icdCode.code)
    if (isSelected) {
      setSelectedICDCodes(selectedICDCodes.filter(c => c.code !== icdCode.code))
    } else {
      setSelectedICDCodes([...selectedICDCodes, icdCode])
    }
  }

  const handleConfirm = () => {
    if (!selectedCondition) {
      alert('Please select a condition')
      return
    }
    updateCaseData({
      confirmedCondition: selectedCondition,
      selectedICDCodes: selectedICDCodes,
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">Stage 2: Condition Confirmation & ICD-10 Mapping</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-3">
            Identified Conditions:
          </label>
          <div className="space-y-2">
            {caseData.identifiedConditions.map((condition) => (
              <label
                key={condition}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="condition"
                  value={condition}
                  checked={selectedCondition === condition}
                  onChange={() => handleConditionSelect(condition)}
                  className="mr-3"
                />
                <span className="text-base text-black">{condition}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedCondition && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-3">
              ICD-10 Codes for {selectedCondition}:
            </label>
            {loading ? (
              <p className="text-gray-500">Loading ICD codes...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
                {icdCodes.length === 0 ? (
                  <p className="text-gray-500">No ICD codes found</p>
                ) : (
                  icdCodes.map((icdCode) => {
                    const isSelected = selectedICDCodes.some(c => c.code === icdCode.code)
                    return (
                      <label
                        key={icdCode.code}
                        className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleICDCodeToggle(icdCode)}
                          className="mt-1 mr-3"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-black">{icdCode.code}</span>
                          <p className="text-sm text-gray-600 mt-1">{icdCode.description}</p>
                        </div>
                      </label>
                    )
                  })
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCondition || selectedICDCodes.length === 0}
            className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Confirm ICD Codes
          </button>
        </div>
      </div>
    </div>
  )
}

