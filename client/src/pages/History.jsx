import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils'
import { MdHistory, MdDeleteOutline, MdDeleteSweep } from 'react-icons/md'

import { useAuth } from '../context/AuthContext'

const TABS = ['Chat', 'Schemes', 'Complaints']
const LANG_LABELS = { en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada' }

export default function History() {
  const { user } = useAuth()
  const [tab, setTab] = useState('Chat')
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/history?userId=${user?.id}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const deleteItem = async (type, id) => {
    await fetch('/api/history', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, id, userId: user?.id }) })
    load()
  }

  const clearAll = async (type) => {
    if (!confirm(`Clear all ${type} history?`)) return
    await fetch('/api/history', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, userId: user?.id }) })
    load()
  }

  const filtered = (list, keys) =>
    list.filter((item) => keys.some((k) => item[k]?.toLowerCase().includes(search.toLowerCase())))

  if (loading) return <main><Spinner /></main>

  const chatList = filtered(data.chatHistory, ['question', 'answer'])
  const schemeList = filtered(data.schemeHistory, ['occupation', 'state'])
  const complaintList = filtered(data.complaints, ['description', 'location', 'id'])

  const counts = { Chat: data.chatHistory.length, Schemes: data.schemeHistory.length, Complaints: data.complaints.length }

  return (
    <main>
      <div className="page-header">
        <h1><MdHistory style={{ verticalAlign: 'middle', marginRight: 8 }} />History</h1>
        <p>All your past queries, scheme searches and complaints.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="history-search" className="sr-only">Search history</label>
        <input id="history-search" className="input" placeholder="🔍 Search history..." value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search history" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 20px', fontSize: '0.88rem' }}>
            {t} <span style={{ opacity: 0.7, marginLeft: 4 }}>({counts[t]})</span>
          </button>
        ))}
      </div>

      {/* Chat Tab */}
      {tab === 'Chat' && (
        <div>
          {chatList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn btn-ghost" style={{ fontSize: '0.82rem', color: 'var(--red)' }} onClick={() => clearAll('chat')} aria-label="Clear all chat history">
                <MdDeleteSweep size={16} /> Clear All
              </button>
            </div>
          )}
          {chatList.length === 0 ? <Empty /> : chatList.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge badge-blue">{LANG_LABELS[item.lang] || item.lang}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{formatDate(item.createdAt)}</span>
                  <button onClick={() => deleteItem('chat', item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} aria-label="Delete this chat"><MdDeleteOutline size={18} /></button>
                </div>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.93rem' }}>Q: {item.question}</div>
              <div className="response-box" style={{ marginTop: 0, fontSize: '0.88rem', maxHeight: 120, overflow: 'hidden', position: 'relative' }}>
                {item.answer.slice(0, 300)}{item.answer.length > 300 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schemes Tab */}
      {tab === 'Schemes' && (
        <div>
          {schemeList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn btn-ghost" style={{ fontSize: '0.82rem', color: 'var(--red)' }} onClick={() => clearAll('scheme')} aria-label="Clear all scheme history">
                <MdDeleteSweep size={16} /> Clear All
              </button>
            </div>
          )}
          {schemeList.length === 0 ? <Empty /> : schemeList.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-green">{item.state}</span>
                  <span className="badge badge-blue">{item.occupation}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{formatDate(item.createdAt)}</span>
                  <button onClick={() => deleteItem('scheme', item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} aria-label="Delete this scheme search"><MdDeleteOutline size={18} /></button>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 8 }}>
                Age: {item.age} · Income: {item.income} · Gender: {item.gender}
              </div>
              <div className="response-box" style={{ marginTop: 0, fontSize: '0.88rem', maxHeight: 120, overflow: 'hidden' }}>
                {item.schemes.slice(0, 300)}{item.schemes.length > 300 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complaints Tab */}
      {tab === 'Complaints' && (
        <div>
          {complaintList.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <button className="btn btn-ghost" style={{ fontSize: '0.82rem', color: 'var(--red)' }} onClick={() => clearAll('complaint')} aria-label="Clear all complaint history">
                <MdDeleteSweep size={16} /> Clear All
              </button>
            </div>
          )}
          {complaintList.length === 0 ? <Empty /> : complaintList.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: 0.5 }}>{item.id}</span>
                  <span className="badge badge-blue">{item.status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>{formatDate(item.createdAt)}</span>
                  <button onClick={() => deleteItem('complaint', item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }} aria-label="Delete this complaint"><MdDeleteOutline size={18} /></button>
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: 8 }}>📍 {item.location} · 👤 {item.name}</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-700)' }}>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

function Empty() {
  return <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-500)' }}>No records yet.</div>
}
