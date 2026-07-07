import { useState } from 'react'
import Spinner from '../components/Spinner'
import LangSelector from '../components/LangSelector'
import { HiOutlineDocumentText } from 'react-icons/hi'

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Gujarat','Haryana','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal','Other']

export default function Schemes() {
  const [form, setForm] = useState({ age: '', income: '', occupation: '', state: '', gender: '' })
  const [lang, setLang] = useState('en')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data.schemes)
      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="page-header">
        <h1><HiOutlineDocumentText style={{ verticalAlign: 'middle', marginRight: 8 }} />Scheme Finder</h1>
        <p>Enter your details to discover government schemes you qualify for.</p>
      </div>

      <div className="card">
        <form onSubmit={submit}>
          <LangSelector value={lang} onChange={setLang} />
          <div className="grid-2">
            <div className="form-group">
              <label>Age</label>
              <input className="input" type="number" placeholder="e.g. 28" value={form.age} onChange={set('age')} required />
            </div>
            <div className="form-group">
              <label>Annual Income</label>
              <input className="input" type="text" placeholder="e.g. 2.5 LPA" value={form.income} onChange={set('income')} required />
            </div>
            <div className="form-group">
              <label>Occupation</label>
              <input className="input" type="text" placeholder="e.g. Farmer, Student" value={form.occupation} onChange={set('occupation')} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <select value={form.state} onChange={set('state')} required>
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={set('gender')}>
                <option value="">Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Finding Schemes...' : '🔍 Find My Schemes'}
          </button>
        </form>
      </div>

      {loading && <Spinner />}
      {error && <div className="error">{error}</div>}

      {result && (
        <div className="card" style={{ borderLeft: '4px solid var(--green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            <h2 style={{ margin: 0, color: 'var(--green)' }}>Schemes Found for You</h2>
            {submitted && <span className="badge badge-green">Personalized</span>}
          </div>
          <div className="response-box" style={{ background: 'white', border: '1px solid var(--gray-200)' }}>{result}</div>
          <button className="btn btn-ghost" style={{ marginTop: 12, fontSize: '0.85rem' }} onClick={() => { setResult(''); setSubmitted(false) }}>
            ← Search Again
          </button>
        </div>
      )}
    </main>
  )
}
