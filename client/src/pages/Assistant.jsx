import { useState, useRef, useEffect } from 'react'
import LangSelector from '../components/LangSelector'
import { useVoice } from '../hooks/useVoice'
import { IoChatbubblesOutline, IoSend } from 'react-icons/io5'
import { BsMicFill, BsStopFill } from 'react-icons/bs'

export default function Assistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste! 🙏 I am Sarthi, your AI civic assistant by BharatSarthiAI. Ask me anything about government services, schemes, or documents.' }
  ])
  const [input, setInput] = useState('')
  const [lang, setLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const { listening, toggle } = useVoice((text) => setInput((q) => q + text), lang)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const ask = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setMessages((m) => [...m, { role: 'user', text: question }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessages((m) => [...m, { role: 'ai', text: data.answer }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'ai', text: `❌ Error: ${err.message}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <div className="page-header">
        <h1><IoChatbubblesOutline style={{ verticalAlign: 'middle', marginRight: 8 }} />AI Assistant</h1>
        <p>Ask any government-related question in your language.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} role="status" aria-label="Sarthi is online" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sarthi is online</span>
          </div>
          <div style={{ width: 200 }}>
            <LangSelector value={lang} onChange={setLang} />
          </div>
        </div>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role}`} role="article" aria-label={m.role === 'ai' ? 'Sarthi response' : 'Your message'}>
              <div className={`bubble-avatar ${m.role}`} aria-hidden="true">{m.role === 'ai' ? '🤖' : '👤'}</div>
              <div className="bubble-text">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble ai">
              <div className="bubble-avatar ai">🤖</div>
              <div className="bubble-text" style={{ background: 'var(--white)', border: '1px solid var(--gray-200)' }}>
                <div className="typing"><span /><span /><span /></div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={ask} style={{ padding: '12px 16px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              id="chat-input"
              className="input"
              placeholder="Type your question or press 🎤 to speak..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ paddingRight: 44 }}
              aria-label="Type your question"
            />
            <button type="button" onClick={toggle} className={`mic-btn ${listening ? 'active' : 'idle'}`} aria-label={listening ? 'Stop listening' : 'Start voice input'}>
              {listening ? <BsStopFill size={14} /> : <BsMicFill size={14} />}
            </button>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()} style={{ padding: '10px 16px' }} aria-label="Send message">
            <IoSend size={16} />
          </button>
        </form>
        {listening && <p style={{ color: 'var(--red)', fontSize: '0.8rem', padding: '0 16px 10px', textAlign: 'center' }}>🔴 Listening... speak now</p>}
      </div>
    </main>
  )
}
