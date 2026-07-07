const LANGUAGES = [
  { code: 'en', label: '🇬🇧 English' },
  { code: 'hi', label: '🇮🇳 Hindi' },
  { code: 'ta', label: '🌿 Tamil' },
  { code: 'te', label: '🌸 Telugu' },
  { code: 'bn', label: '🐟 Bengali' },
  { code: 'mr', label: '🏔 Marathi' },
  { code: 'gu', label: '🪁 Gujarati' },
  { code: 'kn', label: '🌻 Kannada' },
]

export default function LangSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ fontSize: '0.82rem', padding: '6px 10px', borderRadius: 8 }}>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  )
}
