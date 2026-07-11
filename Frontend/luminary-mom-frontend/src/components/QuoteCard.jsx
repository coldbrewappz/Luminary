import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLoves } from '../context/LovesContext'

function QuoteCard({ id, quote, author, tag, theme }) {
  const { toggleLove, isLoved, isLoggedIn } = useLoves()
  const [showNudge, setShowNudge] = useState(false)
  const loved = isLoved(id)

  const bgColor = theme === 'lavender' ? 'bg-lavender' : 'bg-blush'

  async function handleToggle() {
    if (!isLoggedIn) {
      setShowNudge(true)
      setTimeout(() => setShowNudge(false), 4000)
      return
    }
    await toggleLove({ id, text: quote, author, category: tag })
  }

  return (
    <div className={`${bgColor} rounded-sm p-10 flex flex-col gap-4 relative cursor-pointer hover:-translate-y-0.5 transition-transform duration-200`}>

      {/* Opening quote mark */}
      <span className="font-serif text-6xl leading-none text-text-light opacity-40 absolute top-4 left-6">
        "
      </span>

      {/* Quote text */}
      <p className="font-serif text-2xl italic font-light leading-relaxed text-text-dark pt-4">
        {quote}
      </p>

      {/* Author and tag row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs uppercase tracking-widest text-text-mid">
          — {author}
        </span>
        <span className="text-xs uppercase tracking-wider text-text-light bg-white bg-opacity-40 px-3 py-1 rounded-full">
          {tag}
        </span>
      </div>

      {/* Heart button */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 text-xs uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer p-0 w-fit ${loved ? 'text-pink-300' : 'text-text-light hover:text-pink-300'}`}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill={loved ? 'currentColor' : 'none'} strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        {loved ? 'Loved' : 'Love'}
      </button>

      {/* Sign in nudge */}
      {showNudge && (
        <div className="flex items-center gap-2 animate-pulse">
          <p className="text-xs italic text-text-mid">
            Sign in to save this quote 💛{' '}
            <Link to="/login" className="underline hover:text-text-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      )}

    </div>
  )
}

export default QuoteCard