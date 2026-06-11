import { useState } from 'react'
import { useLoves } from '../context/LovesContext'

function LovesPanel({ isOpen, onClose }) {
  const { lovedQuotes, addOwnQuote, removeQuote, QUOTE_CAP } = useLoves()
  const [ownText, setOwnText] = useState('')

  const atCap = lovedQuotes.length >= QUOTE_CAP

  function handleAddOwn() {
    const text = ownText.trim()
    if (!text) return
    const success = addOwnQuote(text)
    if (success) setOwnText('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-linen z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Panel header */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-4xl italic font-light text-text-dark flex items-center gap-3">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="#D4A0A0" fill="#D4A0A0" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            Quotes You Love
          </h2>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-text-mid bg-transparent border-none cursor-pointer hover:text-text-dark transition-colors"
          >
            Close ×
          </button>
        </div>

        <p className="text-xs text-text-light mb-8 tracking-wide">
          Your personal collection — saved quotes and your own words.
        </p>

        {/* Cap indicator */}
        <div className="flex items-center justify-between bg-pink-100 rounded-sm px-4 py-3 mb-6">
          <span className="text-xs text-text-mid tracking-wide">
            {lovedQuotes.length} of {QUOTE_CAP} saved
          </span>
          <div className="w-32 h-1 bg-linen-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-300 rounded-full transition-all duration-300"
              style={{ width: `${(lovedQuotes.length / QUOTE_CAP) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Cap warning */}
        {atCap && (
          <div className="bg-blush rounded-sm px-5 py-4 mb-6">
            <p className="text-sm italic text-text-mid leading-relaxed">
              You've reached your {QUOTE_CAP} quote limit — your collection is full. Remove a quote to make room for something new. 💛
            </p>
          </div>
        )}

        {/* Loved quotes list */}
        {lovedQuotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-serif text-xl italic text-text-light mb-2">
              No quotes loved yet.
            </p>
            <span className="text-xs text-text-light tracking-wide">
              Tap the heart on any quote to add it here.
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-10">
            {lovedQuotes.map(q => (
              <div key={q.id} className="bg-blush rounded-sm px-7 py-6 flex justify-between items-start gap-4">
                <div>
                  <p className="font-serif text-lg italic text-text-dark leading-relaxed mb-1">
                    "{q.text}"
                  </p>
                  <span className="text-xs uppercase tracking-widest text-text-light">
                    — {q.author}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs uppercase tracking-wider bg-pink-100 text-pink-400 px-2 py-0.5 rounded-full">
                    {q.type === 'own' ? 'My words' : 'Quote'}
                  </span>
                  <button
                    onClick={() => removeQuote(q.id)}
                    className="text-text-light hover:text-pink-300 bg-transparent border-none cursor-pointer transition-colors"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Write your own */}
        <div className="border-t border-linen-dark pt-8">
          <h3 className="font-serif text-2xl italic font-light text-text-dark mb-1">
            Write your own words
          </h3>
          <p className="text-xs text-text-light tracking-wide mb-4">
            A thought, a reminder, something that lifts you up. Add it here and it becomes part of your collection.
          </p>
          <textarea
            value={ownText}
            onChange={(e) => setOwnText(e.target.value)}
            maxLength={300}
            placeholder="Write something that lifts you up…"
            className="w-full bg-white border border-linen-dark rounded-sm px-5 py-4 font-serif italic text-text-dark resize-y min-h-24 outline-none focus:border-pink-300 transition-colors placeholder:text-text-light"
          />
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <button
              onClick={handleAddOwn}
              disabled={atCap}
              className="bg-pink-100 text-pink-400 text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm border-none cursor-pointer hover:bg-pink-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to my collection
            </button>
            <span className="text-xs text-text-light">
              {ownText.length} / 300
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LovesPanel