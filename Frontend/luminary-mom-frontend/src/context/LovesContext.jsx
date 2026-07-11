import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import API_BASE_URL from '../config/api'

const LovesContext = createContext()

export const QUOTE_CAP = 20

export function LovesProvider({ children }) {
  const { user, token } = useAuth()
  const [lovedQuotes, setLovedQuotes] = useState([])
  const [personalQuotes, setPersonalQuotes] = useState([])

  // Fetch loves from API when user logs in
  useEffect(() => {
    if (user && token) {
      fetchLoves()
      fetchPersonalQuotes()
    } else {
      // Clear everything on logout
      setLovedQuotes([])
      setPersonalQuotes([])
    }
  }, [user, token])

  async function fetchLoves() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/loves`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setLovedQuotes(data)
    } catch (err) {
      console.error('Error fetching loves:', err)
    }
  }

  async function fetchPersonalQuotes() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/personal`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setPersonalQuotes(data)
    } catch (err) {
      console.error('Error fetching personal quotes:', err)
    }
  }

  async function toggleLove(quote) {
    if (!user || !token) return false

    const isLoved = lovedQuotes.some(q => q.quote?.id === quote.id)

    if (isLoved) {
      try {
        await fetch(`${API_BASE_URL}/api/loves/${quote.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
        setLovedQuotes(prev => prev.filter(q => q.quote?.id !== quote.id))
      } catch (err) {
        console.error('Error removing love:', err)
      }
    } else {
      if (lovedQuotes.length + personalQuotes.length >= QUOTE_CAP) return false
      try {
        const res = await fetch(`${API_BASE_URL}/api/loves`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quoteId: quote.id })
        })
        const saved = await res.json()
        setLovedQuotes(prev => [...prev, saved])
      } catch (err) {
        console.error('Error saving love:', err)
      }
    }
    return true
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
      isLoggedIn: !!user
    }}>
      {children}
    </LovesContext.Provider>
  )
}

export function useLoves() {
  return useContext(LovesContext)
}