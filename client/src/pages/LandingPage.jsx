import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

const features = [
  {
    icon: '🤖', color: '#eff6ff', iconColor: '#2563eb', title: 'AI Civic Assistant',
    points: ['Answer government-related questions', 'Explain procedures simply', 'Support multiple Indian languages', 'Voice-enabled interaction'],
  },
  {
    icon: '📜', color: '#dcfce7', iconColor: '#16a34a', title: 'Smart Scheme Finder',
    points: ['Personalized recommendations', 'Eligibility checking', 'Required documents', 'Step-by-step application guidance'],
  },
  {
    icon: '🚧', color: '#fff7ed', iconColor: '#f97316', title: 'AI Complaint Generator',
    points: ['Converts descriptions into formal complaints', 'Generates Complaint ID', 'Complaint tracking', 'Status simulation'],
  },
  {
    icon: '🌍', color: '#f5f3ff', iconColor: '#7c3aed', title: 'Multilingual & Voice',
    points: ['8 Indian languages', 'Speech-to-text input', 'Localized AI responses', 'Inclusive and accessible'],
  },
]

const stack = [
  { label: 'Frontend', value: 'React + Vite' },
  { label: 'Backend', value: 'Vercel Serverless' },
  { label: 'AI', value: 'LangChain' },
  { label: 'LLM', value: 'Groq / Llama 3' },
  { label: 'Deployment', value: 'Vercel' },
  { label: 'Database', value: 'MongoDB' },
]

const stats = [
  { icon: '🌐', label: '8 Languages Supported' },
  { icon: '🤖', label: 'AI-Powered Assistance' },
  { icon: '📜', label: 'Government Schemes' },
  { icon: '🚧', label: 'Complaint Tracking' },
  { icon: '🎤', label: 'Voice Enabled' },
  { icon: '⚡', label: 'Fast Responses' },
]

const users = [
  { icon: '👨‍🎓', label: 'Students' },
  { icon: '👨‍🌾', label: 'Farmers' },
  { icon: '👩‍💼', label: 'Employees' },
  { icon: '👵', label: 'Senior Citizens' },
  { icon: '👨‍👩‍👧', label: 'Families' },
  { icon: '🏢', label: 'Small Businesses' },
]

const demoMessages = [
  { role: 'user', text: 'How do I apply for a passport?' },
  { role: 'ai', text: 'Upload your identity proof, address proof, and visit the Passport Seva portal at passportindia.gov.in to book an appointment.' },
  { role: 'user', text: 'Recommend schemes for farmers.' },
  { role: 'ai', text: 'Based on your profile, you may be eligible for PM-KISAN (₹6000/year), Pradhan Mantri Fasal Bima Yojana, and Kisan Credit Card scheme.' },
]

const steps = [
  { icon: '👤', label: 'Citizen' },
  { icon: '🔍', label: 'Choose a Service' },
  { icon: '🤖', label: 'AI Processes Request' },
  { icon: '📋', label: 'Smart Recommendation' },
  { icon: '📍', label: 'Track Progress' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [visibleMsg, setVisibleMsg] = useState(0)

  useEffect(() => {
    if (visibleMsg >= demoMessages.length) return
    const t = setTimeout(() => setVisibleMsg((v) => v + 1), 1400)
    return () => clearTimeout(t)
  }, [visibleMsg])

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#0f172a' }}>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={{ fontSize: '3.5rem', marginBottom: 12, animation: 'sparkFloat 3s ease-in-out infinite' }}>🇮🇳</div>
          <h1 style={styles.heroTitle}>Smart Bharat</h1>
          <p style={styles.heroSub}>AI-Powered Civic Companion</p>
          <p style={styles.heroDesc}>
            Empowering citizens with intelligent access to government services through Artificial Intelligence.
            Making civic interactions faster, smarter and more accessible.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '13px 32px' }} onClick={() => navigate('/signup')}>
              Get Started →
            </button>
            <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '13px 32px' }} onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            {['🤖 AI-Powered', '📜 Govt Schemes', '🚧 Complaints', '🌍 8 Languages'].map((t) => (
              <span key={t} className="badge badge-blue" style={{ fontSize: '0.8rem' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={styles.content}>

        {/* ── About ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>What is Smart Bharat?</h2>
          <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1.5px solid rgba(37,99,235,0.15)', textAlign: 'center', padding: '32px 28px' }}>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.8, color: '#334155', maxWidth: 680, margin: '0 auto' }}>
              Smart Bharat is an <strong>AI-powered civic platform</strong> designed to simplify how citizens interact with government services.
              It helps users understand schemes, report public issues, receive multilingual assistance, and track complaints
              through an intelligent AI companion.
            </p>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>✨ Key Features</h2>
          <div className="grid-2">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ marginBottom: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color, color: f.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', marginBottom: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <ul style={{ paddingLeft: 18, color: '#64748b', fontSize: '0.88rem', lineHeight: 2 }}>
                  {f.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo Chat ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🎯 See It In Action</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', padding: '14px 20px', color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
              🤖 Sarthi — AI Civic Assistant
            </div>
            <div className="chat-window" style={{ maxHeight: 280, margin: 0, borderRadius: 0, border: 'none' }}>
              {demoMessages.slice(0, visibleMsg).map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  <div className={`bubble-avatar ${m.role}`}>{m.role === 'ai' ? '🤖' : '👤'}</div>
                  <div className="bubble-text">{m.text}</div>
                </div>
              ))}
              {visibleMsg < demoMessages.length && (
                <div className="chat-bubble ai">
                  <div className="bubble-avatar ai">🤖</div>
                  <div className="bubble-text"><div className="typing"><span /><span /><span /></div></div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📈 How It Works</h2>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
              {steps.map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', maxWidth: 80, textAlign: 'center' }}>{s.label}</div>
                  </div>
                  {i < steps.length - 1 && <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tech Stack ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🛠 Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {stack.map((s) => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '18px 12px', marginBottom: 0, background: '#f8fafc' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e3a8a' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Platform Highlights ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Platform Highlights</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {stats.map((s) => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '20px 12px', marginBottom: 0 }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Security ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔒 Secure & Responsible AI</h2>
          <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)', border: '1.5px solid rgba(22,163,74,0.2)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                '✅ AI guardrails for civic-only responses',
                '✅ Input validation & sanitization',
                '✅ Rate limiting (20 req/min per IP)',
                '✅ Prompt injection protection',
                '✅ Privacy-focused design',
                '✅ Transparent AI assistance',
              ].map((item) => (
                <div key={item} style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>{item}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Who Can Use ── */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>👥 Who Can Use It?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {users.map((u) => (
              <div key={u.label} className="card" style={{ textAlign: 'center', padding: '20px 12px', marginBottom: 0 }}>
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{u.icon}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{u.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ ...styles.section, marginBottom: 0 }}>
          <div className="hero-section" style={{ marginBottom: 0 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 10 }}>🚀 Ready to Get Started?</h2>
            <p style={{ color: '#64748b', marginBottom: 24 }}>Join Smart Bharat and experience AI-powered civic assistance.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ fontSize: '1rem', padding: '13px 32px' }} onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn btn-outline" style={{ fontSize: '1rem', padding: '13px 32px' }} onClick={() => navigate('/signup')}>
                Create Account
              </button>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{ textAlign: 'center', padding: '32px 0 16px', color: '#64748b', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
            {['About', 'Features', 'Technology', 'Contact'].map((l) => (
              <span key={l} style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 500 }}>{l}</span>
            ))}
          </div>
          <p>© 2025 Smart Bharat · BharatSarthiAI · Powered by LangChain + Groq</p>
        </footer>

      </div>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #fff7ed 0%, #eff6ff 50%, #f5f3ff 100%)',
    padding: '64px 16px',
    textAlign: 'center',
    position: 'relative',
    borderBottom: '1px solid rgba(37,99,235,0.1)',
  },
  heroInner: { maxWidth: 680, margin: '0 auto' },
  heroTitle: {
    fontSize: '3.2rem', fontWeight: 900,
    background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text', marginBottom: 6,
  },
  heroSub: { fontSize: '1.3rem', fontWeight: 700, color: '#f97316', marginBottom: 12 },
  heroDesc: { fontSize: '1.05rem', color: '#64748b', lineHeight: 1.7, marginBottom: 28, maxWidth: 560, margin: '0 auto 28px' },
  content: { maxWidth: 900, margin: '0 auto', padding: '0 16px' },
  section: { marginTop: 48 },
  sectionTitle: { fontSize: '1.3rem', fontWeight: 800, marginBottom: 18, color: '#1e3a8a' },
}
