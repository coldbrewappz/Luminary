import { useLoves } from '../context/LovesContext'
import useNotification from '../hooks/useNotification'

function QuoteCard({ id, quote, author, tag, theme }) {
  const { toggleLove, isLoved } = useLoves()
  const { notify } = useNotification()
  const loved = isLoved(id)
  const bgColor = theme === 'lavender' ? 'bg-lavender' : 'bg-blush'

  async function handleToggle() {
    const result = await toggleLove({ id, text: quote, author, category: tag })
    const notifications = {
      auth: {
        type: 'info',
        title: 'Save a little light for later',
        message: 'Create a free account to build your personal collection of encouragement.',
        action: { label: 'Sign in', href: '/login' },
      },
      saved: { type: 'success', title: 'Quote saved', message: 'Added to your collection.' },
      removed: { type: 'removed', title: 'Quote removed', message: 'Removed from your collection.' },
      cap: { type: 'warning', title: 'Your collection is full', message: 'Remove a quote to make room for something new.' },
      error: { type: 'error', title: 'We could not save that quote', message: 'Please try again in a moment.' },
    }
    notify(notifications[result.status])
  }

  return (
    <div className={`${bgColor} rounded-sm p-10 flex flex-col gap-4 relative cursor-pointer hover:-translate-y-0.5 transition-transform duration-200`}>
      <span className="font-serif text-6xl leading-none text-text-light opacity-40 absolute top-4 left-6">"</span>
      <p className="font-serif text-2xl italic font-light leading-relaxed text-text-dark pt-4">{quote}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs uppercase tracking-widest text-text-mid">— {author}</span>
        <span className="text-xs uppercase tracking-wider text-text-light bg-white bg-opacity-40 px-3 py-1 rounded-full">{tag}</span>
      </div>
      <button onClick={handleToggle} className={`flex items-center gap-2 text-xs uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer p-0 w-fit ${loved ? 'text-pink-300' : 'text-text-light hover:text-pink-300'}`}>
        <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill={loved ? 'currentColor' : 'none'} strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        {loved ? 'Loved' : 'Love'}
      </button>
    </div>
  )
}

export default QuoteCard
