import { createContext, useContext, useState, useEffect } from 'react'
import API_BASE_URL from '../config/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken')
    const savedEmail = localStorage.getItem('userEmail')
    if (savedToken && savedEmail) {
      setToken(savedToken)
      setUser({ email: savedEmail })
    }
    setLoading(false)
  }, [])

  async function readErrorMessage(response, fallback) {
    const text = await response.text()
    try {
      const json = JSON.parse(text)
      return json.message || fallback
    } catch {
      return text || fallback
    }
  }

  async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Invalid email or password. Please try again.'))
    }
    const data = await response.json()
    setToken(data.accessToken)
    setUser({ email: data.email })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userEmail', data.email)
    return data
  }

  async function register(email, password) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      throw new Error(await readErrorMessage(response, 'Unable to create your account. Please try again.'))
    }
    const data = await response.json()
    setToken(data.accessToken)
    setUser({ email: data.email })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userEmail', data.email)
    return data
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userEmail')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}