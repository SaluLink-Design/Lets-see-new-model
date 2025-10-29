'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Stage1ClinicalNote from '@/components/Stage1ClinicalNote'
import Stage2ConditionSelection from '@/components/Stage2ConditionSelection'
import Stage3TreatmentProtocols from '@/components/Stage3TreatmentProtocols'
import Stage4TreatmentDocs from '@/components/Stage4TreatmentDocs'
import Stage5MedicationSelection from '@/components/Stage5MedicationSelection'
import Stage6Export from '@/components/Stage6Export'
import Header from '@/components/Header'

export type CaseData = {
  id?: string
  clinicalNote: string
  identifiedConditions: string[]
  confirmedCondition: string | null
  selectedICDCodes: Array<{ code: string; description: string }>
  diagnosticBasket: Array<{
    description: string
    code: string
    numCovered: string
    selected: boolean
    numTimes: number
    documentation?: string
    files?: File[]
  }>
  ongoingBasket: Array<{
    description: string
    code: string
    numCovered: string
    selected: boolean
    numTimes: number
    documentation?: string
    files?: File[]
  }>
  selectedMedications: Array<{
    medicineClass: string
    activeIngredient: string
    medicineName: string
    cdaCore: string
    cdaExecutive: string
    planEligibility: string[]
    excluded: boolean
  }>
  chronicMedNote: string
}

export default function Home() {
  const [currentStage, setCurrentStage] = useState<number>(1)
  const [caseData, setCaseData] = useState<CaseData>({
    clinicalNote: '',
    identifiedConditions: [],
    confirmedCondition: null,
    selectedICDCodes: [],
    diagnosticBasket: [],
    ongoingBasket: [],
    selectedMedications: [],
    chronicMedNote: '',
  })
  const [savedCases, setSavedCases] = useState<CaseData[]>([])

  const updateCaseData = (updates: Partial<CaseData>) => {
    setCaseData((prev) => ({ ...prev, ...updates }))
  }

  const saveCase = () => {
    const newCase = { ...caseData, id: Date.now().toString() }
    setSavedCases((prev) => [...prev, newCase])
    setCaseData({
      clinicalNote: '',
      identifiedConditions: [],
      confirmedCondition: null,
      selectedICDCodes: [],
      diagnosticBasket: [],
      ongoingBasket: [],
      selectedMedications: [],
      chronicMedNote: '',
    })
    setCurrentStage(1)
  }

  const loadCase = (caseItem: CaseData) => {
    setCaseData(caseItem)
    setCurrentStage(1)
  }

  return (
    <div className="flex h-screen bg-[#F2F2F2]">
      <Sidebar savedCases={savedCases} loadCase={loadCase} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {currentStage === 1 && (
            <Stage1ClinicalNote
              caseData={caseData}
              updateCaseData={updateCaseData}
              onNext={() => setCurrentStage(2)}
            />
          )}
          {currentStage === 2 && (
            <Stage2ConditionSelection
              caseData={caseData}
              updateCaseData={updateCaseData}
              onNext={() => setCurrentStage(3)}
              onBack={() => setCurrentStage(1)}
            />
          )}
          {currentStage === 3 && (
            <Stage3TreatmentProtocols
              caseData={caseData}
              updateCaseData={updateCaseData}
              onNext={() => setCurrentStage(4)}
              onBack={() => setCurrentStage(2)}
            />
          )}
          {currentStage === 4 && (
            <Stage4TreatmentDocs
              caseData={caseData}
              updateCaseData={updateCaseData}
              onNext={() => setCurrentStage(5)}
              onBack={() => setCurrentStage(3)}
            />
          )}
          {currentStage === 5 && (
            <Stage5MedicationSelection
              caseData={caseData}
              updateCaseData={updateCaseData}
              onNext={() => setCurrentStage(6)}
              onBack={() => setCurrentStage(4)}
            />
          )}
          {currentStage === 6 && (
            <Stage6Export
              caseData={caseData}
              saveCase={saveCase}
              onBack={() => setCurrentStage(5)}
            />
          )}
        </main>
      </div>
    </div>
  )
}

