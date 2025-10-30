'use client'

import { useState } from 'react'
import { CaseData } from '@/app/page'

interface Stage4Props {
  caseData: CaseData
  updateCaseData: (updates: Partial<CaseData>) => void
  onNext: () => void
  onBack: () => void
}

export default function Stage4TreatmentDocs({ caseData, updateCaseData, onNext, onBack }: Stage4Props) {
  const [diagnosticBasket, setDiagnosticBasket] = useState(caseData.diagnosticBasket)
  const [ongoingBasket, setOngoingBasket] = useState(caseData.ongoingBasket)

  const handleDocChange = (
    index: number,
    value: string,
    type: 'diagnostic' | 'ongoing'
  ) => {
    if (type === 'diagnostic') {
      const updated = [...diagnosticBasket]
      updated[index].documentation = value
      setDiagnosticBasket(updated)
    } else {
      const updated = [...ongoingBasket]
      updated[index].documentation = value
      setOngoingBasket(updated)
    }
  }

  const handleFileUpload = (
    index: number,
    files: FileList | null,
    type: 'diagnostic' | 'ongoing'
  ) => {
    if (!files) return
    const fileArray = Array.from(files)

    if (type === 'diagnostic') {
      const updated = [...diagnosticBasket]
      updated[index].files = [...(updated[index].files || []), ...fileArray]
      setDiagnosticBasket(updated)
    } else {
      const updated = [...ongoingBasket]
      updated[index].files = [...(updated[index].files || []), ...fileArray]
      setOngoingBasket(updated)
    }
  }

  const handleConfirm = () => {
    updateCaseData({
      diagnosticBasket,
      ongoingBasket,
    })
    onNext()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">
          Stage 4: Treatment Documentation
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-black mb-4">Diagnostic Basket Documentation</h3>
          <div className="space-y-4">
            {diagnosticBasket.length === 0 ? (
              <p className="text-gray-500">No diagnostic procedures selected</p>
            ) : (
              diagnosticBasket.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <p className="font-medium text-black">{item.description}</p>
                    <p className="text-sm text-gray-600">Code: {item.code} | Times: {item.numTimes}</p>
                  </div>
                  <textarea
                    value={item.documentation || ''}
                    onChange={(e) => handleDocChange(index, e.target.value, 'diagnostic')}
                    placeholder="Enter documentation notes or results..."
                    className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Upload results (images/PDF)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(index, e.target.files, 'diagnostic')}
                      className="text-sm"
                    />
                    {item.files && item.files.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {item.files.length} file(s) attached
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-black mb-4">Ongoing Management Basket Documentation</h3>
          <div className="space-y-4">
            {ongoingBasket.length === 0 ? (
              <p className="text-gray-500">No ongoing management procedures selected</p>
            ) : (
              ongoingBasket.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <p className="font-medium text-black">{item.description}</p>
                    <p className="text-sm text-gray-600">Code: {item.code} | Times: {item.numTimes}</p>
                  </div>
                  <textarea
                    value={item.documentation || ''}
                    onChange={(e) => handleDocChange(index, e.target.value, 'ongoing')}
                    placeholder="Enter documentation notes or results..."
                    className="w-full h-24 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="mt-2">
                    <label className="block text-sm text-gray-600 mb-1">Upload results (images/PDF)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(index, e.target.files, 'ongoing')}
                      className="text-sm"
                    />
                    {item.files && item.files.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        {item.files.length} file(s) attached
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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
            Confirm Documentation
          </button>
        </div>
      </div>
    </div>
  )
}

