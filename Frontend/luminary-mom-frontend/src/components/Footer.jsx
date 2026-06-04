import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-linen-dark px-8 py-10 bg-linen">
      
      {/* Top row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        
        {/* Brand name */}
        <span className="font-serif text-lg italic text-text-mid">
          Luminary Mom
        </span>

        {/* Nav links */}
        <nav className="flex gap-8">
          <Link
            to="/quotes"
            className="text-xs uppercase tracking-widest text-text-light hover:text-text-dark transition-colors"
          >
            Quotes
          </Link>
          <Link
            to="/about"
            className="text-xs uppercase tracking-widest text-text-light hover:text-text-dark transition-colors"
          >
            About
          </Link>
        </nav>

      </div>

      {/* Bottom row */}
      <div className="mt-6 text-center">
        <p className="text-xs text-text-light tracking-wide">
          Made with love for every mom in the middle of it. © 2026 Luminary Mom
        </p>
      </div>

    </footer>
  )
}

export default Footer