import QuoteCard from './QuoteCard'

const quotes = [
  { id: 1, text: "You are doing better than you think you are.", author: "Unknown", tag: "strength" },
  { id: 2, text: "Almost everything will work again if you unplug it for a few minutes — including you.", author: "Anne Lamott", tag: "rest" },
  { id: 3, text: "Healing is not linear. Be gentle with yourself.", author: "Unknown", tag: "healing" },
  { id: 4, text: "You cannot pour from an empty cup. Take care of yourself first.", author: "Unknown", tag: "self-care" },
  { id: 5, text: "The wound is the place where the light enters you.", author: "Rumi", tag: "healing" },
  { id: 6, text: "Breathe. You are exactly where you need to be.", author: "Unknown", tag: "calm" },
  { id: 7, text: "One day at a time. One hour at a time. One moment at a time.", author: "Unknown", tag: "hope" },
  { id: 8, text: "You were given this life because you are strong enough to live it.", author: "Unknown", tag: "strength" },
]

function QuoteFeed() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-0">
      
      {/* Daily label */}
      <p className="text-xs uppercase tracking-widest text-text-light text-center mb-8">
        A little light for today
      </p>

      {/* Quote cards */}
      {quotes.map((quote, index) => (
        <div key={quote.id}>
          <QuoteCard
            quote={quote.text}
            author={quote.author}
            tag={quote.tag}
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