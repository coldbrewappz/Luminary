import { useEffect, useState } from 'react'

// Floating button that appears once the page is scrolled down and
// smooth-scrolls back to the top when clicked.
function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // set initial state in case the page is already scrolled
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-text-dark text-linen shadow-lg hover:bg-text-mid transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

export default ScrollToTopButton
