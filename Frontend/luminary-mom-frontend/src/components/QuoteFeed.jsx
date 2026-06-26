import { useState, useEffect } from 'react'
import QuoteCard from './QuoteCard'
import API_BASE_URL from '../config/api'

function QuoteFeed({ category }) {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = category
      ? `${API_BASE_URL}/api/quotes/category/${category}`
      : `${API_BASE_URL}/api/quotes`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuotes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching quotes:', err)
        setError(err)
        setLoading(false)
      })
  }, [category])

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <p className="font-serif italic text-text-light text-xl">
        Gathering your light...
      </p>
    </div>
  )

  if (error) return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <p className="font-serif italic text-text-light text-xl">
        Something went wrong. Please try again.
      </p>
    </div>
  )

  if (quotes.length === 0) return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <p className="font-serif italic text-text-light text-xl">
        No quotes found.
      </p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-6 pb-12 flex flex-col gap-0">
      {quotes.map((quote, index) => (
        <div key={quote.id}>
          <QuoteCard
            quote={quote.text}
            id={quote.id}
            author={quote.author}
            tag={quote.category}
            theme={index % 2 === 0 ? 'lavender' : 'blush'}
          />
          {index < quotes.length - 1 && (
            <hr className="border-none border-t border-linen-dark my-10" />
          )}
        </div>
      ))}
    </div>
  )
}

export default QuoteFeed