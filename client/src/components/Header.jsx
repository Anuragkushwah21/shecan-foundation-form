// src/components/Header.jsx
import React, { useState } from 'react'
import Navbar from './Navbar'

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-violet-800">
            She Can Foundation
          </h1>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden inline-flex flex-col items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
            <span className="block w-5 h-0.5 bg-slate-700 mb-1" />
            <span className="block w-5 h-0.5 bg-slate-700" />
          </button>

          {/* Desktop / tablet navbar */}
          <div className="hidden sm:block">
            <Navbar />
          </div>
        </div>

        {/* Mobile dropdown navbar */}
        {open && (
          <div className="mt-2 sm:hidden">
            <Navbar mobile onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header