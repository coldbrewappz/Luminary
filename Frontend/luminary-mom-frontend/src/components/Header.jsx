import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLoves } from '../context/LovesContext'
import LovesPanel from './LovesPanel'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const { lovedQuotes } = useLoves()

  return (
    <>
      <header className="sticky top-0 z-40 bg-linen border-b border-linen-dark px-8 h-16 flex items-center justify-between">

        {/* Site Name */}
        <Link to="/" className="font-serif text-2xl italic text-text-dark no-underline">
          Luminary Mom
        </Link>

        <div className="flex items-center gap-5">

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10">
            <Link to="/" className="text-xs uppercase tracking-widest text-text-mid hover:text-text-dark transition-colors">
              Home
            </Link>
            <Link to="/quotes" className="text-xs uppercase tracking-widest text-text-mid hover:text-text-dark transition-colors">
              Quotes
            </Link>
            <Link to="/about" className="text-xs uppercase tracking-widest text-text-mid hover:text-text-dark transition-colors">
              About
            </Link>
          </nav>

          {/* Heart icon */}
          <button
            onClick={() => setPanelOpen(true)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-1 rounded-full hover:bg-pink-100 transition-colors"
            aria-label="Quotes you love"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="#D4A0A0"
              fill={lovedQuotes.length > 0 ? '#D4A0A0' : 'none'}
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {lovedQuotes.length > 0 && (
              <span className="text-xs text-pink-400 font-medium">
                {lovedQuotes.length}
              </span>
            )}
          </button>

          {/* Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 cursor-pointer bg-transparent border-none p-1"
            aria-label="Menu"
          >
            <span className={`block w-5 h-px bg-text-dark transition-all duration-300 ${menuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
            <span className={`block w-5 h-px bg-text-dark transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-px bg-text-dark transition-all duration-300 ${menuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
          </button>

        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-16 right-0 w-52 bg-linen border-l border-b border-linen-dark px-8 py-6 flex flex-col gap-4 z-50">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="font-serif text-2xl italic text-text-dark hover:text-text-mid transition-colors"
            >
              Home
            </Link>
            <Link
              to="/quotes"
              onClick={() => setMenuOpen(false)}
              className="font-serif text-2xl italic text-text-dark hover:text-text-mid transition-colors"
            >
              Quotes
            </Link>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className="font-serif text-2xl italic text-text-dark hover:text-text-mid transition-colors"
            >
              About
            </Link>
            <button
              onClick={() => { setPanelOpen(true); setMenuOpen(false); }}
              className="flex items-center gap-2 font-serif text-2xl italic text-text-dark hover:text-text-mid transition-colors bg-transparent border-none cursor-pointer p-0 text-left"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="#D4A0A0" fill="none" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
              Quotes You Love
            </button>
          </div>
        )}

      </header>

      {/* The panel itself */}
      <LovesPanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} />
    </>
  )
}

export default Header