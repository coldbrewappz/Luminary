import QuoteFeed from '../components/QuoteFeed'

function QuotesPage() {
  return (
    <div>

      {/* Hero */}
      <section className="text-center px-6 py-20 border-b border-linen-dark">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          A light for the postpartum journey
        </p>
        <h1 className="font-serif text-5xl italic font-light text-text-dark leading-tight mb-5">
          You are not alone<br />in this.
        </h1>
        <p className="text-sm text-text-mid tracking-wide leading-relaxed max-w-sm mx-auto">
          Words that hold you when the night is long. Save what resonates. Return whenever you need.
        </p>
      </section>

      {/* Quote Feed */}
      <QuoteFeed />

    </div>
  )
}

export default QuotesPage