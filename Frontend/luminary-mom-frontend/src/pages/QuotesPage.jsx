import { useState } from 'react'
import { categories, quotes } from '../data/quotes'
import CategoryTile from '../components/CategoryTile'
import QuoteFeed from '../components/QuoteFeed'

function QuotesPage() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [showAllQuotes, setShowAllQuotes] = useState(false)

  function handleTileClick(categoryId) {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
    } else {
      setActiveCategory(categoryId)
      setShowAllQuotes(false)
    }
  }

  const filteredQuotes = activeCategory
    ? quotes.filter(q => q.category === activeCategory)
    : quotes

  const activeCategoryData = categories.find(c => c.id === activeCategory)

  // Which tiles are visible: just the selected one, or all of them
  const visibleCategories = activeCategory
    ? categories.filter(c => c.id === activeCategory)
    : categories

  // The feed shows if a category is picked OR the mom asked to see all
  const showFeed = activeCategory !== null || showAllQuotes

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
          {activeCategory
            ? 'Tap the tile again to see all categories.'
            : 'Choose a category that speaks to you.'}
        </p>
      </section>

      {/* Category Tiles */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-text-light text-center mb-6">
          {activeCategory ? 'Your category' : 'Browse by category'}
        </p>
        <div className={activeCategory ? 'max-w-sm mx-auto' : 'grid grid-cols-2 gap-3'}>
          {visibleCategories.map(cat => {
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

      {/* View all quotes button — only when nothing is selected */}
      {!showFeed && (
        <div className="text-center pb-16">
          <button
            onClick={() => setShowAllQuotes(true)}
            className="font-serif text-lg italic text-text-mid border-b border-linen-dark pb-0.5 hover:text-text-dark hover:border-text-mid transition-colors bg-transparent cursor-pointer"
          >
            Or wander through every quote →
          </button>
        </div>
      )}

      {/* Quote Feed */}
      {showFeed && (
        <>
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-between pt-8 mb-10 border-t border-linen-dark">
              <p className="text-xs uppercase tracking-widest text-text-light">
                {activeCategoryData
                  ? `${activeCategoryData.emoji} ${activeCategoryData.name}`
                  : 'All quotes'}
              </p>
              {showAllQuotes && !activeCategory && (
                <button
                  onClick={() => setShowAllQuotes(false)}
                  className="text-xs uppercase tracking-widest text-text-light hover:text-text-dark transition-colors bg-transparent border-none cursor-pointer"
                >
                  Hide ×
                </button>
              )}
            </div>
          </div>
          <QuoteFeed category={activeCategory} />
        </>
      )}

    </div>
  )
}

export default QuotesPage