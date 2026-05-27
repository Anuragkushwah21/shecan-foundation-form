// src/components/Footer.jsx
import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-3 text-xs text-slate-500 flex justify-between">
        <span>© {new Date().getFullYear()} She Can Foundation</span>
        <span>Built with React & Express</span>
      </div>
    </footer>
  )
}

export default Footer