'use client'

import { CaseData } from '@/app/page'
import { useState } from 'react'

interface SidebarProps {
  savedCases: CaseData[]
  loadCase: (caseItem: CaseData) => void
}

export default function Sidebar({ savedCases, loadCase }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-[282px] h-full bg-gradient-to-b from-[#F2F2F2] to-[#F2F2F2] border-r border-[#1C1C1C]/10 flex flex-col justify-between">
      <div className="p-5 border-b border-[#1C1C1C]/10">
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
          <span className="text-sm font-normal text-black">Clear conversations</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v6m0 6v6M23 12h-6M7 12H1" />
          </svg>
          <span className="text-sm font-normal text-black">Light mode</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-sm font-normal text-black">My account</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="text-sm font-normal text-black">Updates & FAQ</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-sm font-normal text-black">Log out</span>
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-black mb-2">Saved Cases</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedCases.length === 0 ? (
              <p className="text-xs text-gray-500">No saved cases</p>
            ) : (
              savedCases.map((caseItem, index) => (
                <div
                  key={caseItem.id || index}
                  onClick={() => loadCase(caseItem)}
                  className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 border border-gray-200"
                >
                  <p className="text-xs font-medium text-black truncate">
                    {caseItem.confirmedCondition || 'Untitled Case'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {caseItem.clinicalNote.substring(0, 50)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

