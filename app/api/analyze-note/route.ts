import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const targetConditions = [
  'Cardiac Failure',
  'Hypertension',
  'Diabetes insipidus',
  'Diabetes mellitus type 1',
  'Diabetes mellitus type 2',
]

function extractConditions(clinicalNote: string): string[] {
  const identifiedConditions = new Set<string>()
  const noteLower = clinicalNote.toLowerCase()

  for (const condition of targetConditions) {
    const conditionLower = condition.toLowerCase()
    const regex = new RegExp(`\\b${conditionLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    if (regex.test(noteLower)) {
      identifiedConditions.add(condition)
    }
  }

  return Array.from(identifiedConditions)
}

export async function POST(request: Request) {
  try {
    const { clinicalNote } = await request.json()

    if (!clinicalNote || typeof clinicalNote !== 'string') {
      return NextResponse.json(
        { error: 'Clinical note is required' },
        { status: 400 }
      )
    }

    const identifiedConditions = extractConditions(clinicalNote)

    return NextResponse.json({
      identifiedConditions,
      confidence: identifiedConditions.length > 0 ? 0.85 : 0,
    })
  } catch (error) {
    console.error('Error analyzing note:', error)
    return NextResponse.json(
      { error: 'Failed to analyze clinical note' },
      { status: 500 }
    )
  }
}

