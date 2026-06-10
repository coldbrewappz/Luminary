import { createContext, useContext, useState } from 'react'
import { QUOTE_CAP } from '../data/quotes'

const LovesContext = createContext()

export function LovesProvider({ children }) {
  const [lovedQuotes, setLovedQuotes] = useState(
    JSON.parse(localStorage.getItem('luminaryLoved') || '[]')
  )

  function save(updated) {
    setLovedQuotes(updated)
    localStorage.setItem('luminaryLoved', JSON.stringify(updated))
  }

  function toggleLove(quote) {
    const exists = lovedQuotes.some(q => q.id === quote.id)
    if (exists) {
      save(lovedQuotes.filter(q => q.id !== quote.id))
    } else {
      if (lovedQuotes.length >= QUOTE_CAP) return false
      save([...lovedQuotes, { ...quote, type: 'quote' }])
    }
    return true
  }

  function addOwnQuote(text) {
    if (lovedQuotes.length >= QUOTE_CAP) return false
    save([...lovedQuotes, { id: Date.now(), text, author: 'My words', type: 'own' }])
    return true
  }

  function removeQuote(id) {
    save(lovedQuotes.filter(q => q.id !== id))
  }

  function isLoved(id) {
    return lovedQuotes.some(q => q.id === id)
  }

  return (
    <LovesContext.Provider value={{ lovedQuotes, toggleLove, addOwnQuote, removeQuote, isLoved, QUOTE_CAP }}>
      {children}
    </LovesContext.Provider>
  )
}

export function useLoves() {
  return useContext(LovesContext)
}