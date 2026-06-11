function AboutPage() {
  return (
    <div>

      {/* Hero */}
      <section className="text-center px-6 py-20 border-b border-linen-dark">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          Our story
        </p>
        <h1 className="font-serif text-5xl italic font-light text-text-dark leading-tight">
          Built by a mom,<br />for moms.
        </h1>
      </section>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          Our why
        </p>
        <h2 className="font-serif text-3xl italic font-light text-text-dark leading-tight mb-6">
          A small, steady light.
        </h2>
        <p className="text-sm font-light text-text-mid leading-loose mb-4">
          The postpartum period is one of the most quietly difficult seasons of a woman's life. Luminary Mom was created to be a small, steady light — a place to come when you need a reminder that what you're feeling is valid, and that you are not alone.
        </p>
        <p className="text-sm font-light text-text-mid leading-loose">
          We believe in the power of words to shift a moment. Sometimes one sentence is enough to help you breathe again.
        </p>
      </div>

    </div>
  )
}

export default AboutPage