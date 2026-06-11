import QuoteCard from './QuoteCard'

function QuoteFeed({ quotes }) {
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