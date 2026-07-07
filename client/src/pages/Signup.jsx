import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
const nameRe = /^[a-zA-Z\s]{2,}$/

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', lang: 'en' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!nameRe.test(form.name)) e.name = 'Letters only, min 2 characters.'
    if (!emailRe.test(form.email)) e.email = 'Enter a valid email address.'
    if (!passwordRe.test(form.password)) e.password = 'Min 8 chars with uppercase, lowercase, number & special character.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true); setApiError('')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.user)
      navigate('/')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🇮🇳</div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Create Account</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>Join BharatSarthiAI today</p>
        </div>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="input" type="text" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} required />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Min 8 chars, uppercase, number, symbol" value={form.password} onChange={set('password')} required />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Preferred Language</label>
            <select value={form.lang} onChange={set('lang')}>
              <option value="en">🇬🇧 English</option>
              <option value="hi">🇮🇳 Hindi</option>
              <option value="ta">🌿 Tamil</option>
              <option value="te">🌸 Telugu</option>
              <option value="bn">🐟 Bengali</option>
              <option value="mr">🏔 Marathi</option>
              <option value="gu">🪁 Gujarati</option>
              <option value="kn">🌻 Kannada</option>
            </select>
          </div>
          {apiError && <div className="error">{apiError}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.9rem', color: 'var(--gray-500)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
