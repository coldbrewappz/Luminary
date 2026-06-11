function CategoryTile({ category, isActive, onClick }) {
  const bgColor = category.theme === 'lavender' ? 'bg-lavender' : 'bg-blush'
  const borderColor = isActive ? 'border-text-mid' : 'border-transparent'

  return (
    <div
      onClick={onClick}
      className={`${bgColor} ${borderColor} border-2 rounded-sm p-8 flex flex-col gap-1 cursor-pointer hover:-translate-y-0.5 transition-transform duration-200`}
    >
      {/* Emoji */}
      <span className="text-2xl mb-1">
        {category.emoji}
      </span>

      {/* Category name */}
      <span className="font-serif text-2xl italic font-light text-text-dark leading-tight">
        {category.name}
      </span>

      {/* Quote count */}
      <span className="text-xs uppercase tracking-widest text-text-light">
        {category.count} quotes
      </span>

    </div>
  )
}

export default CategoryTile