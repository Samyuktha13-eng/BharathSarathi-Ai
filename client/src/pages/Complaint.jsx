import { useState } from 'react'
import Spinner from '../components/Spinner'
import LangSelector from '../components/LangSelector'
import { useVoice } from '../hooks/useVoice'
import { MdOutlineReportProblem } from 'react-icons/md'
import { BsMicFill, BsStopFill } from 'react-icons/bs'

const STATUSES = ['Submitted', 'In Review', 'Resolved']
const STATUS_INFO = {
  'Submitted':  { badge: 'badge-blue',   icon: '📥', desc: 'Your complaint has been received.' },
  'In Review':  { badge: 'badge-yellow', icon: '🔄', desc: 'Being reviewed by the department.' },
  'Resolved':   { badge: 'badge-green',  icon: '✅', desc: 'Issue has been resolved.' },
}

export default function Complaint() {
  const [form, setForm] = useState({ name: '', location: '', description: '' })
  const [lang, setLang] = useState('en')
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('Submitted')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const { listening, toggle } = useVoice((text) => setForm((f) => ({ ...f, description: f.description + text })), lang)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null); setStatus('Submitted')
    try {
      const res = await fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const nextStatus = () => {
    const idx = STATUSES.indexOf(status)
    if (idx < STATUSES.length - 1) setStatus(STATUSES[idx + 1])
  }

  const si = STATUS_INFO[status]

  return (
    <main>
      <div className="page-header">
        <h1><MdOutlineReportProblem style={{ verticalAlign: 'middle', marginRight: 8 }} />File a Complaint</h1>
        <p>Describe your issue — AI will convert it into a formal complaint letter.</p>
      </div>

      {!result ? (
        <div className="card">
          <form onSubmit={submit}>
            <LangSelector value={lang} onChange={setLang} />
            <div className="grid-2">
              <div className="form-group">
                <label htmlFor="complaint-name">Your Name (optional)</label>
                <input id="complaint-name" className="input" type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label htmlFor="complaint-location">Location *</label>
                <input id="complaint-location" className="input" type="text" placeholder="e.g. Pune, Maharashtra" value={form.location} onChange={set('location')} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="complaint-desc">Describe Your Issue *</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  id="complaint-desc"
                  className="input" rows={4} required
                  placeholder="e.g. There is no street light on our road for 2 months..."
                  value={form.description} onChange={set('description')}
                  style={{ paddingRight: 48 }}
                  aria-label="Describe your issue"
                />
                <button type="button" onClick={toggle} className={`mic-btn ${listening ? 'active' : 'idle'}`} aria-label={listening ? 'Stop voice input' : 'Start voice input'}>
                  {listening ? <BsStopFill size={14} /> : <BsMicFill size={14} />}
                </button>
              </div>
              {listening && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 4 }}>🔴 Listening... speak now</p>}
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} aria-label="Submit complaint">
              {loading ? 'Generating...' : '📝 Submit Complaint'}
            </button>
          </form>
          {loading && <Spinner />}
          {error && <div className="error">{error}</div>}
        </div>
      ) : (
        <div>
          <div className="complaint-card">
            <div className="complaint-card-header">
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 2 }}>COMPLAINT ID</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1 }}>{result.complaintId}</div>
              </div>
              <span className={`badge ${si.badge}`} style={{ fontSize: '0.85rem' }}>{si.icon} {status}</span>
            </div>
            <div className="complaint-card-body">
              <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 16 }}>
                📍 {form.location} &nbsp;·&nbsp; 👤 {form.name || 'Anonymous'}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${si.badge}`}>{si.icon} {status}</span>
                  <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>{si.desc}</span>
                  {status !== 'Resolved' && (
                    <button className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8rem', marginLeft: 'auto' }} onClick={nextStatus}>
                      Simulate Update →
                    </button>
                  )}
                </div>
              </div>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Generated Complaint</div>
              <div className="response-box">{result.formalComplaint}</div>
            </div>
          </div>

          <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { setResult(null); setForm({ name: '', location: '', description: '' }) }}>
            ← File Another Complaint
          </button>
        </div>
      )}
    </main>
  )
}
