'use client'

import { useState } from 'react'
import { CaseData } from '@/app/page'
import jsPDF from 'jspdf'
// @ts-ignore - jspdf-autotable extends jsPDF prototype
import 'jspdf-autotable'

interface Stage6Props {
  caseData: CaseData
  saveCase: () => void
  onBack: () => void
}

export default function Stage6Export({ caseData, saveCase, onBack }: Stage6Props) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = () => {
    setIsGenerating(true)
    
    try {
      const doc = new jsPDF()
      
      // Title
      doc.setFontSize(20)
      doc.text('SaluLink Chronic Treatment Report', 14, 20)
      
      let yPos = 30

      // Clinical Note
      doc.setFontSize(14)
      doc.text('Original Clinical Note:', 14, yPos)
      yPos += 7
      doc.setFontSize(10)
      const clinicalNoteLines = doc.splitTextToSize(caseData.clinicalNote || 'N/A', 180)
      doc.text(clinicalNoteLines, 14, yPos)
      yPos += clinicalNoteLines.length * 5 + 10

      // Confirmed Condition
      doc.setFontSize(14)
      doc.text('Confirmed Condition:', 14, yPos)
      yPos += 7
      doc.setFontSize(10)
      doc.text(caseData.confirmedCondition || 'N/A', 14, yPos)
      yPos += 10

      // ICD Codes
      if (caseData.selectedICDCodes.length > 0) {
        doc.setFontSize(14)
        doc.text('Selected ICD-10 Codes:', 14, yPos)
        yPos += 7
        
        const icdTableData = caseData.selectedICDCodes.map(icd => [
          icd.code,
          icd.description
        ])
        
        doc.autoTable({
          startY: yPos,
          head: [['ICD-10 Code', 'Description']],
          body: icdTableData,
          theme: 'grid',
        })
        
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Diagnostic Basket
      if (caseData.diagnosticBasket.length > 0) {
        doc.setFontSize(14)
        doc.text('Diagnostic Basket:', 14, yPos)
        yPos += 7
        
        const diagTableData = caseData.diagnosticBasket.map(item => [
          item.description,
          item.code,
          item.numTimes.toString(),
          item.documentation || 'N/A'
        ])
        
        doc.autoTable({
          startY: yPos,
          head: [['Procedure/Test', 'Code', 'Times', 'Documentation']],
          body: diagTableData,
          theme: 'grid',
        })
        
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Ongoing Management Basket
      if (caseData.ongoingBasket.length > 0) {
        doc.setFontSize(14)
        doc.text('Ongoing Management Basket:', 14, yPos)
        yPos += 7
        
        const ongTableData = caseData.ongoingBasket.map(item => [
          item.description,
          item.code,
          item.numTimes.toString(),
          item.documentation || 'N/A'
        ])
        
        doc.autoTable({
          startY: yPos,
          head: [['Procedure/Test', 'Code', 'Times', 'Documentation']],
          body: ongTableData,
          theme: 'grid',
        })
        
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Medications
      if (caseData.selectedMedications.length > 0) {
        doc.setFontSize(14)
        doc.text('Selected Medications:', 14, yPos)
        yPos += 7
        
        const medTableData = caseData.selectedMedications.map(med => [
          med.medicineName,
          med.activeIngredient,
          med.medicineClass,
          med.cdaCore,
          med.cdaExecutive
        ])
        
        doc.autoTable({
          startY: yPos,
          head: [['Medicine Name', 'Active Ingredient', 'Class', 'CDA Core/Saver', 'CDA Executive']],
          body: medTableData,
          theme: 'grid',
        })
        
        yPos = (doc as any).lastAutoTable.finalY + 10
      }

      // Chronic Medication Note
      if (caseData.chronicMedNote) {
        doc.setFontSize(14)
        doc.text('Chronic Medication Registration Note:', 14, yPos)
        yPos += 7
        doc.setFontSize(10)
        const noteLines = doc.splitTextToSize(caseData.chronicMedNote, 180)
        doc.text(noteLines, 14, yPos)
      }

      // Save PDF
      doc.save(`SaluLink-Report-${caseData.confirmedCondition}-${Date.now()}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
        <h2 className="text-2xl font-medium text-black mb-6">
          Stage 6: Final Claim Compilation and Export
        </h2>

        <div className="space-y-6 mb-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-black mb-2">Case Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Condition:</strong> {caseData.confirmedCondition || 'N/A'}</p>
              <p><strong>ICD Codes:</strong> {caseData.selectedICDCodes.length} selected</p>
              <p><strong>Diagnostic Procedures:</strong> {caseData.diagnosticBasket.length} selected</p>
              <p><strong>Ongoing Procedures:</strong> {caseData.ongoingBasket.length} selected</p>
              <p><strong>Medications:</strong> {caseData.selectedMedications.length} selected</p>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-yellow-50">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This application does not submit requests to medical aids. 
              The PDF export is for documentation and compliance purposes only.
            </p>
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
            onClick={generatePDF}
            disabled={isGenerating}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isGenerating ? 'Generating...' : 'Export as PDF'}
          </button>
          <button
            onClick={saveCase}
            className="px-6 py-3 bg-[#1C1C1C] text-white rounded-xl hover:bg-[#2C2C2C] transition-colors font-medium"
          >
            Save Case
          </button>
        </div>
      </div>
    </div>
  )
}

