'use client'

import { useState, useEffect } from 'react'
import { CaseData } from '@/app/page'

interface Stage3Props {
  caseData: CaseData
  updateCaseData: (updates: Partial<CaseData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Stage3TreatmentProtocols({ caseData, updateCaseData, onNext, onBack }: Stage3Props) {
  const [loading, setLoading] = useState(false)
  const [diagnosticBasket, setDiagnosticBasket] = useState(
    caseData.diagnosticBasket.length > 0
      ? caseData.diagnosticBasket
      : []
  )
  const [ongoingBasket, setOngoingBasket] = useState(
    caseData.ongoingBasket.length > 0
      ? caseData.ongoingBasket
      : []
  )

  useEffect(() => {
    if (caseData.confirmedCondition && (diagnosticBasket.length === 0 || ongoingBasket.length === 0)) {
      loadTreatmentProtocols()
    }
  }, [caseData.confirmedCondition])

  const loadTreatmentProtocols = async () => {
    if (!caseData.confirmedCondition) return

    setLoading(true)
    try {
      const response = await fetch('/api/get-treatment-protocols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: caseData.confirmedCondition }),
      })

      const data = await response.json()

      const diagnosticItems = (data.diagnosticBasket || []).map((item: any) => ({
        ...item,
        selected: false,
        numTimes: 1,
      }))

      const ongoingItems = (data.ongoingBasket || []).map((item: any) => ({
        ...item,
        selected: false,
        numTimes: 1,
      }))

      setDiagnosticBasket(diagnosticItems)
      setOngoingBasket(ongoingItems)
    } catch (error) {
      console.error('Error loading treatment protocols:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDiagnosticToggle = (index: number) => {
    const updated = [...diagnosticBasket]
    updated[index].selected = !updated[index].selected
    setDiagnosticBasket(updated)
  }

  const handleOngoingToggle = (index: number) => {
    const updated = [...ongoingBasket]
    updated[index].selected = !updated[index].selected
    setOngoingBasket(updated)
  }

  const handleNumTimesChange = (index: number, value: number, type: 'diagnostic' | 'ongoing') => {
    if (type === 'diagnostic') {
      const updated = [...diagnosticBasket]
      updated[index].numTimes = Math.max(1, value)
      setDiagnosticBasket(updated)
    } else {
      const updated = [...ongoingBasket]
      updated[index].numTimes = Math.max(1, value)
      setOngoingBasket(updated)
    }
  }

  const handleConfirm = () => {
    updateCaseData({
      diagnosticBasket: diagnosticBasket.filter(item => item.selected),
      ongoingBasket: ongoingBasket.filter(item => item.selected),
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">
          Stage 3: Treatment Protocol Selection
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading treatment protocols...</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium text-black mb-4">Diagnostic Basket</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {diagnosticBasket.length === 0 ? (
                  <p className="text-gray-500">No diagnostic procedures found</p>
                ) : (
                  diagnosticBasket.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleDiagnosticToggle(index)}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-black">{item.description}</p>
                        <p className="text-sm text-gray-600">Code: {item.code}</p>
                        <p className="text-sm text-gray-600">Covered: {item.numCovered}</p>
                      </div>
                      {item.selected && (
                        <input
                          type="number"
                          min="1"
                          value={item.numTimes}
                          onChange={(e) =>
                            handleNumTimesChange(index, parseInt(e.target.value) || 1, 'diagnostic')
                          }
                          className="w-20 px-2 py-1 border rounded"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-black mb-4">Ongoing Management Basket</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto border rounded-lg p-4">
                {ongoingBasket.length === 0 ? (
                  <p className="text-gray-500">No ongoing management procedures found</p>
                ) : (
                  ongoingBasket.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleOngoingToggle(index)}
                        className="mr-2"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-black">{item.description}</p>
                        <p className="text-sm text-gray-600">Code: {item.code}</p>
                        <p className="text-sm text-gray-600">Covered: {item.numCovered}</p>
                      </div>
                      {item.selected && (
                        <input
                          type="number"
                          min="1"
                          value={item.numTimes}
                          onChange={(e) =>
                            handleNumTimesChange(index, parseInt(e.target.value) || 1, 'ongoing')
                          }
                          className="w-20 px-2 py-1 border rounded"
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
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
            className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl hover:bg-[#2C2C2C] transition-colors font-medium"
          >
            Confirm Treatment Selection
          </button>
        </div>
      </div>
    </div>
  )
}

