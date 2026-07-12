import { useState } from 'react'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils'
import { TbMapSearch } from 'react-icons/tb'

import { useAuth } from '../context/AuthContext'

const STEPS = ['Submitted', 'In Review', 'Resolved']

export default function Track() {
  const { user } = useAuth()
  const [id, setId] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const track = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setComplaint(null)
    try {
      const res = await fetch(`/api/track?id=${id.trim()}&userId=${user?.id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setComplaint(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentStep = complaint ? STEPS.indexOf(complaint.status) : -1

  return (
    <main>
      <div className="page-header">
        <h1><TbMapSearch style={{ verticalAlign: 'middle', marginRight: 8 }} />Track Complaint</h1>
        <p>Enter your Complaint ID to check its current status.</p>
      </div>

      <div className="card">
        <form onSubmit={track} style={{ display: 'flex', gap: 10 }}>
          <label htmlFor="track-id" className="sr-only">Complaint ID</label>
          <input
            id="track-id"
            className="input" placeholder="e.g. SB-BAA670C4"
            value={id} onChange={(e) => setId(e.target.value)}
            required style={{ flex: 1 }}
            aria-label="Enter complaint ID"
          />
          <button className="btn btn-primary" type="submit" disabled={loading || !id.trim()} aria-label="Track complaint status">
            {loading ? '...' : 'Track'}
          </button>
        </form>
      </div>

      {loading && <Spinner />}
      {error && <div className="error">❌ {error}</div>}

      {complaint && (
        <div className="complaint-card">
          <div className="complaint-card-header">
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: 2 }}>COMPLAINT ID</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: 1 }}>{complaint.id}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.82rem', opacity: 0.85 }}>
              <div>📍 {complaint.location}</div>
              <div>🗓 {formatDate(complaint.createdAt)}</div>
            </div>
          </div>

          <div className="complaint-card-body">
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>Status Timeline</div>

            <div className="timeline">
              {STEPS.map((step, i) => {
                const done = i < currentStep
                const active = i === currentStep
                return (
                  <div key={step} className={`timeline-step ${done ? 'done' : ''}`}>
                    <div className={`timeline-dot ${done ? 'done' : active ? 'active' : ''}`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <div className="timeline-label">
                      <strong style={{ color: active ? 'var(--blue)' : done ? 'var(--green)' : 'var(--gray-500)' }}>{step}</strong>
                      <span>{done ? 'Completed' : active ? 'Current stage' : 'Pending'}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Original Issue</div>
              <p style={{ color: 'var(--gray-700)', marginBottom: 16, fontSize: '0.93rem' }}>{complaint.description}</p>

              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Formal Complaint</div>
              <div className="response-box">{complaint.formalComplaint}</div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
