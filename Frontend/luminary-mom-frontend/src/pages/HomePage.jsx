import { Link } from 'react-router-dom'
import DailyQuote from '../components/DailyQuote'

function HomePage() {
  return (
    <div>

      {/* Hero */}
      <section className="text-center px-6 py-20 border-b border-linen-dark">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          A light for the postpartum journey
        </p>
        <h1 className="font-serif text-5xl italic font-light text-text-dark leading-tight mb-0">
          You are not alone<br />in this.
        </h1>
      </section>

      {/* Daily Quote */}
      <div className="max-w-xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-text-light text-center mb-8">
          Today's light
        </p>
        <DailyQuote />
      </div>

      {/* Browse More */}
      <div className="text-center pb-16">
        <Link
          to="/quotes"
          className="font-serif text-lg italic text-text-mid border-b border-linen-dark pb-0.5 hover:text-text-dark hover:border-text-mid transition-colors"
        >
          Need more light? Browse all quotes →
        </Link>
      </div>

      {/* Our Why */}
      <section className="border-t border-linen-dark">
        <div className="max-w-xl mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-widest text-text-light mb-5">
            Our why
          </p>
          <h2 className="font-serif text-4xl italic font-light text-text-dark leading-tight mb-6">
            Built by a mom,<br />for moms.
          </h2>
          <p className="text-sm font-light text-text-mid leading-loose mb-4 max-w-md">
            The postpartum period is one of the most quietly difficult seasons of a woman's life. Luminary Mom was created to be a small, steady light — a place to come when you need a reminder that what you're feeling is valid, and that you are not alone.
          </p>
          <p className="text-sm font-light text-text-mid leading-loose max-w-md">
            We believe in the power of words to shift a moment. Sometimes one sentence is enough to help you breathe again.
          </p>
        </div>
      </section>

    </div>
  )
}

export default HomePage