import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, user } = useAuth()
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🇮🇳</div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>BharatSarthiAI</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Sign in to your account</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input id="login-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required aria-label="Email address" />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input id="login-password" className="input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required aria-label="Password" />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} aria-label="Sign in to your account">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--gray-500)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}
