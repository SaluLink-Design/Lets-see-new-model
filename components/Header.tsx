'use client'

export default function Header() {
  return (
    <header className="bg-[#F2F2F2] border-b border-[#1C1C1C]/10 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">SL</span>
          </div>
          <div>
            <h1 className="text-2xl font-normal text-black">Authi 1.0</h1>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg hover:bg-[#2C2C2C] transition-colors text-sm font-normal">
          View Cases
        </button>
        <button className="px-4 py-2 bg-[#1C1C1C] text-white rounded-lg hover:bg-[#2C2C2C] transition-colors text-sm font-normal">
          New Case
        </button>
      </div>
    </header>
  )
}

