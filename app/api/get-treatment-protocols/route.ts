import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { condition } = await request.json()

    if (!condition) {
      return NextResponse.json(
        { error: 'Condition is required' },
        { status: 400 }
      )
    }

    const csvPath = path.join(
      process.cwd(),
      'Cardiovascular and Endocrine Treatments.csv'
    )
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')

    const diagnosticBasket: Array<{
      description: string
      code: string
      numCovered: string
    }> = []
    const ongoingBasket: Array<{
      description: string
      code: string
      numCovered: string
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
        // Skip header rows
        if (values[1] === 'PROCEDURE OR TEST DESCRIPTION') continue

        const diagDesc = values[1]
        const diagCode = values[2]
        const diagNum = values[3]

        const ongDesc = values[4]
        const ongCode = values[5]
        const ongNum = values[6]

        if (diagDesc && diagDesc !== 'nan' && diagDesc !== '') {
          diagnosticBasket.push({
            description: diagDesc,
            code: diagCode || '',
            numCovered: diagNum || '',
          })
        }

        if (ongDesc && ongDesc !== 'nan' && ongDesc !== '') {
          ongoingBasket.push({
            description: ongDesc,
            code: ongCode || '',
            numCovered: ongNum || '',
          })
        }
      }
    }

    return NextResponse.json({ diagnosticBasket, ongoingBasket })
  } catch (error) {
    console.error('Error getting treatment protocols:', error)
    return NextResponse.json(
      { error: 'Failed to get treatment protocols' },
      { status: 500 }
    )
  }
}

