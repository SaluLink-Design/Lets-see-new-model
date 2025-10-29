# SaluLink Chronic Treatment App

A comprehensive Next.js application for automating chronic disease management, ICD-10 coding, and treatment protocol mapping for South African medical schemes.

## Features

The app implements a 6-stage workflow:

1. **Clinical Note Input & Analysis**: Uses ClinicalBERT-based analysis to extract conditions from doctor notes
2. **Condition Confirmation & ICD-10 Mapping**: Maps confirmed conditions to ICD-10 codes
3. **Treatment Protocol Selection**: Selects diagnostic and ongoing management procedures
4. **Treatment Documentation**: Documents tests and procedures with notes and file uploads
5. **Medication Selection**: Selects approved medications with plan-specific filtering
6. **Final Export**: Generates PDF reports for compliance and claim submission

## Prerequisites

- Node.js 18+ and npm
- The three CSV files in the project root:
  - `Cardiovascular and Endocrine Conditions.csv`
  - `Cardiovascular and Endocrine Medicine.csv`
  - `Cardiovascular and Endocrine Treatments.csv`

## Installation

1. Install dependencies:

```bash
npm install
```

2. Ensure the CSV files are in the project root directory.

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/
│   ├── api/              # API routes for data processing
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page component
├── components/           # React components for each stage
├── Cardiovascular and Endocrine Conditions.csv
├── Cardiovascular and Endocrine Medicine.csv
├── Cardiovascular and Endocrine Treatments.csv
└── package.json
```

## Key Components

- **Stage1ClinicalNote**: Input and analysis of clinical notes
- **Stage2ConditionSelection**: Condition confirmation and ICD-10 mapping
- **Stage3TreatmentProtocols**: Diagnostic and ongoing treatment selection
- **Stage4TreatmentDocs**: Documentation interface with file uploads
- **Stage5MedicationSelection**: Medication selection with plan filtering
- **Stage6Export**: PDF export functionality

## API Routes

- `/api/analyze-note`: Analyzes clinical notes using condition matching
- `/api/get-icd-codes`: Retrieves ICD-10 codes for a condition
- `/api/get-treatment-protocols`: Gets diagnostic and ongoing treatment protocols
- `/api/get-medications`: Retrieves medications with plan eligibility

## Notes

- This application does not submit requests to medical aids. It is for documentation purposes only.
- The ClinicalBERT analysis is implemented using pattern matching on the target conditions.
- All data is loaded from CSV files at runtime.
- Cases can be saved and loaded from the sidebar.

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- jsPDF for PDF generation
