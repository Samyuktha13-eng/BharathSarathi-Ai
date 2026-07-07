import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { HiOutlineDocumentText } from 'react-icons/hi'
import { MdOutlineReportProblem } from 'react-icons/md'
import { TbMapSearch } from 'react-icons/tb'
import { MdHistory } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: <IoChatbubblesOutline size={22} />, color: '#eff6ff', iconColor: '#2563eb', title: 'AI Assistant', desc: 'Ask any government question in your language.', path: '/assistant', tag: 'Multilingual' },
  { icon: <HiOutlineDocumentText size={22} />, color: '#dcfce7', iconColor: '#16a34a', title: 'Scheme Finder', desc: 'Discover schemes you qualify for.', path: '/schemes', tag: 'Personalized' },
  { icon: <MdOutlineReportProblem size={22} />, color: '#fff7ed', iconColor: '#f97316', title: 'File Complaint', desc: 'Convert your issue into a formal complaint.', path: '/complaint', tag: 'Voice Enabled' },
  { icon: <TbMapSearch size={22} />, color: '#fee2e2', iconColor: '#dc2626', title: 'Track Complaint', desc: 'Check real-time complaint status.', path: '/track', tag: 'Live Status' },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState({ totalChats: 0, totalSchemes: 0, totalComplaints: 0 })

  useEffect(() => {
    fetch('/api/history').then((r) => r.json()).then((d) => setStats(d.stats)).catch(() => {})
  }, [])

  return (
    <main>
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-flag">🇮🇳</div>
        <h1>Welcome, {user?.name.split(' ')[0]}!</h1>
        <p>Your AI-Powered Civic Companion — government services made simple for every Indian citizen.</p>
        <button className="btn" style={{ background: 'var(--orange)', color: 'white', fontWeight: 700, fontSize: '1rem', padding: '12px 32px' }} onClick={() => navigate('/assistant')}>
          Get Started →
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'AI Queries', value: stats.totalChats, icon: '💬', color: '#eff6ff', tc: '#2563eb' },
          { label: 'Schemes Searched', value: stats.totalSchemes, icon: '📋', color: '#dcfce7', tc: '#16a34a' },
          { label: 'Complaints Filed', value: stats.totalComplaints, icon: '📝', color: '#fff7ed', tc: '#f97316' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center', background: s.color, border: 'none', marginBottom: 0 }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: s.tc }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {features.map((f) => (
          <div key={f.path} className="card card-feature" onClick={() => navigate(f.path)}>
            <div className="feature-icon" style={{ background: f.color, color: f.iconColor }}>{f.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem' }}>{f.title}</h2>
              <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{f.tag}</span>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginBottom: 16 }}>{f.desc}</p>
            <span style={{ color: 'var(--blue)', fontWeight: 600, fontSize: '0.88rem' }}>Open →</span>
          </div>
        ))}
      </div>

      {/* History shortcut */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 12 }} onClick={() => navigate('/history')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MdHistory size={22} color="var(--blue)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>View History</div>
            <div style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>All past chats, schemes and complaints</div>
          </div>
        </div>
        <span style={{ color: 'var(--blue)', fontWeight: 600 }}>→</span>
      </div>

      <div className="card" style={{ textAlign: 'center', background: 'var(--gray-50)', border: '1px dashed var(--gray-200)' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>
          🔒 BharatSarthiAI · Powered by LangChain + Groq · Supports 8 Indian languages
        </p>
      </div>
    </main>
  )
}
