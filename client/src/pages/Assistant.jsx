import { useState, useRef, useEffect } from 'react'
import LangSelector from '../components/LangSelector'
import { useVoice } from '../hooks/useVoice'
import { IoChatbubblesOutline, IoSend } from 'react-icons/io5'
import { BsMicFill, BsStopFill } from 'react-icons/bs'
import { MdAdd, MdHistory, MdSearch, MdClose } from 'react-icons/md'

const MSG_LIMIT = 20

const storageKey = (userId) => `sarthi_sessions_${userId}`
const loadSessions = (userId) => {
  try { return JSON.parse(localStorage.getItem(storageKey(userId))) || [] } catch { return [] }
}
const saveSessions = (userId, sessions) => localStorage.setItem(storageKey(userId), JSON.stringify(sessions))

const newSession = () => ({
  id: Date.now().toString(),
  title: 'New Chat',
  messages: [{ role: 'ai', text: 'Namaste! 🙏 I am Sarthi, your AI civic assistant. Ask me anything about government services, schemes, or documents.' }],
  createdAt: new Date().toISOString(),
})

import { useAuth } from '../context/AuthContext'

export default function Assistant() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState(() => {
    const s = loadSessions(user?.id)
    return s.length ? s : [newSession()]
  })
  const [activeId, setActiveId] = useState(() => {
    const s = loadSessions(user?.id)
    return s.length ? s[0].id : null
  })
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const bottomRef = useRef(null)

  const active = sessions.find((s) => s.id === activeId) || sessions[0]
  const msgCount = active?.messages.filter((m) => m.role === 'user').length || 0
  const nearLimit = msgCount >= MSG_LIMIT - 5
  const atLimit = msgCount >= MSG_LIMIT

  useEffect(() => {
    if (sessions.length) {
      saveSessions(user?.id, sessions)
      if (!activeId) setActiveId(sessions[0].id)
    }
  }, [sessions])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [active?.messages, loading])

  const { listening, toggle } = useVoice((text) => setInput((q) => q + text), lang)

  const updateActive = (updater) => {
    setSessions((prev) => prev.map((s) => s.id === activeId ? updater(s) : s))
  }

  const startNewChat = () => {
    const s = newSession()
    setSessions((prev) => [s, ...prev])
    setActiveId(s.id)
    setInput('')
  }

  const deleteSession = (id, e) => {
    e.stopPropagation()
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      if (id === activeId && updated.length) setActiveId(updated[0].id)
      if (!updated.length) {
        const s = newSession()
        setActiveId(s.id)
        return [s]
      }
      return updated
    })
  }

  const ask = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading || atLimit) return
    const question = input.trim()
    setInput('')

    const isFirst = active.messages.filter((m) => m.role === 'user').length === 0
    const title = isFirst ? question.slice(0, 40) : active.title

    updateActive((s) => ({ ...s, title, messages: [...s.messages, { role: 'user', text: question }] }))
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang, userId: user?.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      updateActive((s) => ({ ...s, messages: [...s.messages, { role: 'ai', text: data.answer }] }))
    } catch (err) {
      const msg = err.message === 'Invalid input detected'
        ? "I'm here to help with government services, civic issues, and public schemes. I can't assist with that request."
        : 'Something went wrong. Please try again.'
      updateActive((s) => ({ ...s, messages: [...s.messages, { role: 'ai', text: msg }] }))
    } finally {
      setLoading(false)
    }
  }

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <main style={{ padding: 0, maxWidth: '100%' }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 64px)', maxWidth: 1100, margin: '0 auto', gap: 0 }}>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div style={{ width: 260, borderRight: '1px solid var(--gray-200)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', flexShrink: 0 }}>

            {/* New Chat */}
            <div style={{ padding: '12px 12px 8px' }}>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 6, fontSize: '0.9rem', padding: '10px' }} onClick={startNewChat}>
                <MdAdd size={18} /> New Chat
              </button>
            </div>

            {/* Search */}
            <div style={{ padding: '0 12px 8px', position: 'relative' }}>
              <MdSearch size={16} style={{ position: 'absolute', left: 22, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-500)' }} />
              <input
                className="input"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 32, fontSize: '0.85rem', padding: '8px 8px 8px 32px' }}
              />
            </div>

            {/* Sessions list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '0.82rem', padding: '20px 0' }}>No chats found</div>
              )}
              {filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  style={{
                    padding: '10px 10px', borderRadius: 10, cursor: 'pointer', marginBottom: 4,
                    background: s.id === activeId ? 'var(--blue-light)' : 'transparent',
                    border: s.id === activeId ? '1.5px solid rgba(37,99,235,0.2)' : '1.5px solid transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <MdHistory size={14} color="var(--gray-500)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.83rem', fontWeight: s.id === activeId ? 600 : 400, color: s.id === activeId ? 'var(--blue)' : 'var(--gray-700)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.title}
                    </span>
                  </div>
                  <button onClick={(e) => deleteSession(s.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-500)', flexShrink: 0, padding: 2, borderRadius: 4, display: 'flex' }}>
                    <MdClose size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--gray-200)', fontSize: '0.75rem', color: 'var(--gray-500)', textAlign: 'center' }}>
              {sessions.length} chat{sessions.length !== 1 ? 's' : ''} saved locally
            </div>
          </div>
        )}

        {/* ── Main Chat ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Header */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.95)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setSidebarOpen((v) => !v)} className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
                ☰
              </button>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sarthi</span>
              {active && <span style={{ fontSize: '0.78rem', color: 'var(--gray-500)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{active.title}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {nearLimit && !atLimit && (
                <span style={{ fontSize: '0.75rem', color: 'var(--orange)', fontWeight: 600 }}>
                  ⚠️ {MSG_LIMIT - msgCount} messages left
                </span>
              )}
              <div style={{ width: 180 }}>
                <LangSelector value={lang} onChange={setLang} />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-window" style={{ flex: 1, maxHeight: 'none', borderRadius: 0, border: 'none', margin: 0 }}>
            {active?.messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <div className={`bubble-avatar ${m.role}`}>{m.role === 'ai' ? '🤖' : '👤'}</div>
                <div className="bubble-text">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-bubble ai">
                <div className="bubble-avatar ai">🤖</div>
                <div className="bubble-text"><div className="typing"><span /><span /><span /></div></div>
              </div>
            )}
            {atLimit && (
              <div style={{ textAlign: 'center', padding: '12px 16px' }}>
                <div style={{ background: 'var(--orange-light)', border: '1.5px solid var(--orange)', borderRadius: 12, padding: '12px 16px', display: 'inline-block' }}>
                  <p style={{ color: 'var(--orange)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 8 }}>
                    🚦 Message limit reached ({MSG_LIMIT} messages)
                  </p>
                  <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 20px' }} onClick={startNewChat}>
                    <MdAdd size={16} /> Start New Chat
                  </button>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={ask} style={{ padding: '12px 16px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 8, background: 'rgba(255,255,255,0.95)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                className="input"
                placeholder={atLimit ? 'Start a new chat to continue...' : 'Type your question or press 🎤 to speak...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ paddingRight: 44 }}
                disabled={atLimit}
              />
              <button type="button" onClick={toggle} className={`mic-btn ${listening ? 'active' : 'idle'}`} disabled={atLimit}>
                {listening ? <BsStopFill size={14} /> : <BsMicFill size={14} />}
              </button>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading || !input.trim() || atLimit} style={{ padding: '10px 16px' }}>
              <IoSend size={16} />
            </button>
          </form>
          {listening && <p style={{ color: 'var(--red)', fontSize: '0.8rem', padding: '0 16px 10px', textAlign: 'center' }}>🔴 Listening... speak now</p>}
        </div>
      </div>
    </main>
  )
}
