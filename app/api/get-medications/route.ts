import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { condition, planType } = await request.json()

    if (!condition) {
      return NextResponse.json(
        { error: 'Condition is required' },
        { status: 400 }
      )
    }

    const csvPath = path.join(
      process.cwd(),
      'Cardiovascular and Endocrine Medicine.csv'
    )
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')

    const medications: Array<{
      medicineClass: string
      activeIngredient: string
      medicineName: string
      cdaCore: string
      cdaExecutive: string
      planEligibility: string[]
      excluded: boolean
    }> = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      // Parse CSV line
      const values: string[] = []
      let current = ''
      let inQuotes = false

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      values.push(current.trim())

      const conditionColumn = values[0]
      if (conditionColumn && conditionColumn.toLowerCase().includes(condition.toLowerCase())) {
        const medicineName = (values[5] || '').replace(/\n/g, ' ').trim()
        const medicineClass = values[3] || ''
        const activeIngredient = values[4] || ''
        const cdaCore = values[1] || ''
        const cdaExecutive = values[2] || ''

        // Check for plan exclusions
        const fullText = line.toLowerCase()
        const isKeyCareExcluded = fullText.includes('not available on keycare plans')
        const isOnlyExecutive = fullText.includes('only executive and comprehensive plans')
        
        let excluded = false
        const planEligibility: string[] = []

        if (isKeyCareExcluded) {
          excluded = planType === 'KeyCare'
          if (!excluded) {
            planEligibility.push('Core', 'Priority', 'Saver', 'Executive', 'Comprehensive')
          }
        } else if (isOnlyExecutive) {
          excluded = !['Executive', 'Comprehensive'].includes(planType)
          if (!excluded) {
            planEligibility.push('Executive', 'Comprehensive')
          } else {
            planEligibility.push('Core', 'Priority', 'Saver')
          }
        } else {
          planEligibility.push('KeyCare', 'Core', 'Priority', 'Saver', 'Executive', 'Comprehensive')
        }

        medications.push({
          medicineClass,
          activeIngredient,
          medicineName,
          cdaCore,
          cdaExecutive,
          planEligibility,
          excluded: excluded && planType ? excluded : false,
        })
      }
    }

    return NextResponse.json({ medications })
  } catch (error) {
    console.error('Error getting medications:', error)
    return NextResponse.json(
      { error: 'Failed to get medications' },
      { status: 500 }
    )
  }
}

