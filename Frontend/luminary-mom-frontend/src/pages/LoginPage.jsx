import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="font-serif text-2xl italic text-text-dark">
            Luminary Mom
          </Link>
          <p className="text-xs uppercase tracking-widest text-text-light mt-3">
            Welcome back
          </p>
          <h1 className="font-serif text-4xl italic font-light text-text-dark mt-2">
            Sign in
          </h1>
        </div>

        {/* Form */}
        <div className="bg-lavender rounded-sm p-8">

          {/* Error message */}
          {error && (
            <div className="bg-blush rounded-sm px-4 py-3 mb-6">
              <p className="text-sm text-text-mid italic">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-mid">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mom@gmail.com"
                className="bg-white border border-linen-dark rounded-sm px-4 py-3 font-sans text-sm text-text-dark outline-none focus:border-lavender-deep transition-colors placeholder:text-text-light"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-mid">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border border-linen-dark rounded-sm px-4 py-3 font-sans text-sm text-text-dark outline-none focus:border-lavender-deep transition-colors placeholder:text-text-light"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-text-dark text-linen text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-text-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-text-light mt-6">
          New here?{' '}
          <Link
            to="/register"
            className="text-text-mid hover:text-text-dark transition-colors underline"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  )
}

export default LoginPage