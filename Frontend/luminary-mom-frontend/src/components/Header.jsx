import { useState } from 'react'
import { Link } from 'react-router-dom'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-linen border-b border-linen-dark px-8 h-16 flex items-center justify-between">
      
      {/* Site Name */}
      <Link to="/" className="font-serif text-2xl italic text-text-dark no-underline">
        Luminary Mom
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-10">
        <Link to="/quotes" className="text-xs uppercase tracking-widest text-text-mid hover:text-text-dark transition-colors">
          Quotes
        </Link>
        <Link to="/about" className="text-xs uppercase tracking-widest text-text-mid hover:text-text-dark transition-colors">
          About
        </Link>
      </nav>

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

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 w-48 bg-linen border-l border-b border-linen-dark px-8 py-6 flex flex-col gap-4 z-50">
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
        </div>
      )}

    </header>
  )
}

export default Header