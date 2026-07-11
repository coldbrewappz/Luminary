import { useState, useEffect } from 'react'
import { useLoves } from '../context/LovesContext'
import API_BASE_URL from '../config/api'
import useNotification from '../hooks/useNotification'

function DailyQuote() {
  const { toggleLove, isLoved } = useLoves()
  const { notify } = useNotification()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/quotes/daily`)
      .then(res => res.json())
      .then(data => {
        setQuote(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching daily quote:', err)
        setError(err)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="bg-lavender rounded-sm p-10 flex items-center justify-center min-h-48">
      <p className="font-serif italic text-text-light text-xl">Finding today's light...</p>
    </div>
  )

  if (error || !quote) return (
    <div className="bg-lavender rounded-sm p-10 flex items-center justify-center min-h-48">
      <p className="font-serif italic text-text-light text-xl">Something went wrong. Please try again.</p>
    </div>
  )

  const loved = isLoved(quote.id)

  async function handleToggle() {
    const result = await toggleLove({ id: quote.id, text: quote.text, author: quote.author, category: quote.category })
    const notifications = {
      auth: {
        type: 'info',
        title: 'Save a little light for later',
        message: 'Create a free account to build your personal collection of encouragement.',
        action: { label: 'Sign in', href: '/login' },
      },
      saved: { type: 'success', title: 'Quote saved', message: 'Added to your collection.' },
      removed: { type: 'removed', title: 'Quote removed', message: 'Removed from your collection.' },
      cap: { type: 'warning', title: 'Your collection is full', message: 'Remove a quote to make room for something new.' },
      error: { type: 'error', title: 'We could not save that quote', message: 'Please try again in a moment.' },
    }
    notify(notifications[result.status])
  }

  return (
    <div className="bg-lavender rounded-sm p-10 relative hover:-translate-y-0.5 transition-transform duration-200">

      {/* Quote mark */}
      <span className="font-serif text-6xl leading-none text-text-light opacity-30 absolute top-4 left-6">
        "
      </span>

      {/* Quote text */}
      <p className="font-serif text-2xl italic font-light leading-relaxed text-text-dark pt-4 mb-6">
        {quote.text}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest text-text-mid">
          — {quote.author}
        </span>
        <span className="text-xs uppercase tracking-wider text-text-light bg-white bg-opacity-40 px-3 py-1 rounded-full">
          {quote.category}
        </span>
      </div>

      {/* Heart button */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 text-xs uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer p-0 ${loved ? 'text-pink-300' : 'text-text-light hover:text-pink-300'}`}
      >
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill={loved ? 'currentColor' : 'none'} strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
        {loved ? 'Loved' : 'Love'}
      </button>

    </div>
  )
}

export default DailyQuote
