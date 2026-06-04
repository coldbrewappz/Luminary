import { useState } from 'react'

function QuoteCard({ quote, author, tag, theme }) {
  const [saved, setSaved] = useState(false)

  const bgColor = theme === 'lavender' ? 'bg-lavender' : 'bg-blush'

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

      {/* Save button */}
      <button
        onClick={() => setSaved(!saved)}
        className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-light hover:text-text-dark transition-colors bg-transparent border-none cursor-pointer p-0 w-fit"
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          stroke="currentColor"
          fill={saved ? 'currentColor' : 'none'}
          strokeWidth="1.5"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
        {saved ? 'Saved' : 'Save'}
      </button>

    </div>
  )
}

export default QuoteCard