import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import API_BASE_URL from '../config/api'

const LovesContext = createContext()

export const QUOTE_CAP = 20

export function LovesProvider({ children }) {
  const { user, token } = useAuth()
  const [lovedQuotes, setLovedQuotes] = useState([])
  const [personalQuotes, setPersonalQuotes] = useState([])
  const [quotesLoading, setQuotesLoading] = useState(false)
  const [quotesError, setQuotesError] = useState(null)

  // Fetch loves from API when user logs in
  useEffect(() => {
    if (user && token) {
      loadCollection()
    } else {
      // Clear everything on logout
      setLovedQuotes([])
      setPersonalQuotes([])
      setQuotesError(null)
    }
  }, [user, token])

  async function loadCollection() {
    setQuotesLoading(true)
    setQuotesError(null)
    try {
      await Promise.all([fetchLoves(), fetchPersonalQuotes()])
    } finally {
      setQuotesLoading(false)
    }
  }

  async function fetchLoves() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/loves`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Unable to load your saved quotes.')
      const data = await res.json()
      setLovedQuotes(data)
    } catch (err) {
      console.error('Error fetching loves:', err)
      setQuotesError('We had trouble loading your collection. Please refresh to try again.')
    }
  }

  async function fetchPersonalQuotes() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/personal`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Unable to load your personal quotes.')
      const data = await res.json()
      setPersonalQuotes(data)
    } catch (err) {
      console.error('Error fetching personal quotes:', err)
      setQuotesError('We had trouble loading your collection. Please refresh to try again.')
    }
  }

  async function toggleLove(quote) {
    if (!user || !token) return { status: 'auth' }

    const isLoved = lovedQuotes.some(q => q.quote?.id === quote.id)

    if (isLoved) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/loves/${quote.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Unable to remove quote')
        setLovedQuotes(prev => prev.filter(q => q.quote?.id !== quote.id))
        return { status: 'removed' }
      } catch (err) {
        console.error('Error removing love:', err)
        return { status: 'error' }
      }
    } else {
      if (lovedQuotes.length + personalQuotes.length >= QUOTE_CAP) return { status: 'cap' }
      try {
        const res = await fetch(`${API_BASE_URL}/api/loves`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quoteId: quote.id })
        })
        if (!res.ok) throw new Error('Unable to save quote')
        const saved = await res.json()
        setLovedQuotes(prev => [...prev, saved])
        return { status: 'saved' }
      } catch (err) {
        console.error('Error saving love:', err)
        return { status: 'error' }
      }
    }
  }

  async function addOwnQuote(text) {
    if (!user || !token) return false
    if (lovedQuotes.length + personalQuotes.length >= QUOTE_CAP) return false

    try {
      const res = await fetch(`${API_BASE_URL}/api/personal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      })
      const saved = await res.json()
      setPersonalQuotes(prev => [...prev, saved])
      return true
    } catch (err) {
      console.error('Error adding personal quote:', err)
      return false
    }
  }

  async function removeQuote(id, type) {
    if (!user || !token) return

    if (type === 'own') {
      try {
        await fetch(`${API_BASE_URL}/api/personal/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        setPersonalQuotes(prev => prev.filter(q => q.id !== id))
      } catch (err) {
        console.error('Error removing personal quote:', err)
      }
    } else {
      try {
        await fetch(`${API_BASE_URL}/api/loves/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        setLovedQuotes(prev => prev.filter(q => q.quote?.id !== id))
      } catch (err) {
        console.error('Error removing love:', err)
      }
    }
  }

  function isLoved(id) {
    return lovedQuotes.some(q => q.quote?.id === id)
  }

  return (
    <LovesContext.Provider value={{
      lovedQuotes,
      personalQuotes,
      toggleLove,
      addOwnQuote,
      removeQuote,
      isLoved,
      QUOTE_CAP,
      isLoggedIn: !!user,
      quotesLoading,
      quotesError,
      refetchCollection: loadCollection
    }}>
      {children}
    </LovesContext.Provider>
  )
}

export function useLoves() {
  return useContext(LovesContext)
}
