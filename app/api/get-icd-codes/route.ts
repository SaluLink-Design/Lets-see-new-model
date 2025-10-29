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
      'Cardiovascular and Endocrine Conditions.csv'
    )
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',')

    const icdCodes: Array<{ code: string; description: string }> = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) continue

      // Handle CSV parsing with quotes
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
        icdCodes.push({
          code: values[1] || '',
          description: values[2] || '',
        })
      }
    }

    return NextResponse.json({ icdCodes })
  } catch (error) {
    console.error('Error getting ICD codes:', error)
    return NextResponse.json(
      { error: 'Failed to get ICD codes' },
      { status: 500 }
    )
  }
}

