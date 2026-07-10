import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      await register(email, password)
      navigate('/')
    } catch (err) {
      setError('An account with this email already exists.')
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
            Join us
          </p>
          <h1 className="font-serif text-4xl italic font-light text-text-dark mt-2">
            Create account
          </h1>
          <p className="text-sm text-text-light mt-2 leading-relaxed">
            A safe space just for you. 💛
          </p>
        </div>

        {/* Form */}
        <div className="bg-blush rounded-sm p-8">

          {/* Error message */}
          {error && (
            <div className="bg-white rounded-sm px-4 py-3 mb-6">
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
                className="bg-white border border-linen-dark rounded-sm px-4 py-3 font-sans text-sm text-text-dark outline-none focus:border-blush-deep transition-colors placeholder:text-text-light"
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
                className="bg-white border border-linen-dark rounded-sm px-4 py-3 font-sans text-sm text-text-dark outline-none focus:border-blush-deep transition-colors placeholder:text-text-light"
              />
              <p className="text-xs text-text-light">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-text-mid">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white border border-linen-dark rounded-sm px-4 py-3 font-sans text-sm text-text-dark outline-none focus:border-blush-deep transition-colors placeholder:text-text-light"
              />
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-text-dark text-linen text-xs uppercase tracking-widest py-3 rounded-sm hover:bg-text-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-text-light mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-text-mid hover:text-text-dark transition-colors underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage