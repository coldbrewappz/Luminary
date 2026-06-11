import { useState } from 'react'
import { categories, quotes } from '../data/quotes'
import CategoryTile from '../components/CategoryTile'
import QuoteFeed from '../components/QuoteFeed'

function QuotesPage() {
  const [activeCategory, setActiveCategory] = useState(null)

  function handleTileClick(categoryId) {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
    } else {
      setActiveCategory(categoryId)
    }
  }

  const filteredQuotes = activeCategory
    ? quotes.filter(q => q.category === activeCategory)
    : quotes

  const activeCategoryData = categories.find(c => c.id === activeCategory)

  return (
    <div>

      {/* Hero */}
      <section className="text-center px-6 py-16 border-b border-linen-dark">
        <p className="text-xs uppercase tracking-widest text-text-light mb-5">
          Find your light today
        </p>
        <h1 className="font-serif text-5xl italic font-light text-text-dark leading-tight mb-3">
          Quotes
        </h1>
        <p className="text-sm text-text-mid tracking-wide">
          Choose a category or scroll through all quotes below.
        </p>
      </section>

      {/* Category Tiles */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-text-light text-center mb-6">
          Browse by category
        </p>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => {
            const count = quotes.filter(q => q.category === cat.id).length
            return (
              <CategoryTile
                key={cat.id}
                category={{ ...cat, count }}
                isActive={activeCategory === cat.id}
                onClick={() => handleTileClick(cat.id)}
              />
            )
          })}
        </div>
      </div>

      {/* Quote Feed */}
      <div className="max-w-2xl mx-auto px-6">
        <p className="text-xs uppercase tracking-widest text-text-light text-center mb-10 pt-8 border-t border-linen-dark">
          {activeCategoryData ? `${activeCategoryData.emoji} ${activeCategoryData.name}` : 'All quotes'}
        </p>
      </div>
      <QuoteFeed quotes={filteredQuotes} />

    </div>
  )
}

export default QuotesPage