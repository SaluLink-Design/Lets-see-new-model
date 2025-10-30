'use client'

import { useState } from 'react'
import { CaseData } from '@/app/page'

interface Stage1Props {
  caseData: CaseData
  updateCaseData: (updates: Partial<CaseData>) => void
  onNext: () => void
}

export default function Stage1ClinicalNote({ caseData, updateCaseData, onNext }: Stage1Props) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [note, setNote] = useState(caseData.clinicalNote)

  const handleAnalyze = async () => {
    if (!note.trim()) {
      alert('Please enter a clinical note')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clinicalNote: note }),
      })

      const data = await response.json()

      if (data.identifiedConditions && data.identifiedConditions.length > 0) {
        updateCaseData({
          clinicalNote: note,
          identifiedConditions: data.identifiedConditions,
        })
        onNext()
      } else {
        alert('No conditions identified. Please try a different note or proceed manually.')
      }
    } catch (error) {
      console.error('Error analyzing note:', error)
      alert('Failed to analyze note. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">Stage 1: Clinical Note Input & Analysis</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Patient Notes:
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-48 p-4 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter or paste the patient's clinical note here..."
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !note.trim()}
          className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl hover:bg-[#2C2C2C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyse'}
        </button>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> ClinicalBERT will analyze your note to identify potential chronic conditions including:
            Cardiac Failure, Hypertension, Diabetes Insipidus, Diabetes Mellitus Type 1, and Diabetes Mellitus Type 2.
          </p>
        </div>
      </div>
    </div>
  )
}

